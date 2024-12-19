"""Face Age Net model."""

import os

import cv2
import numpy as np
import torch
from django.conf import settings
from PIL import Image
from torch import nn
from torch.nn.functional import interpolate
from torchvision import transforms
from torchvision.ops.boxes import batched_nms


def fixed_batch_process(im_data, model):
    """Fixed batch process."""
    batch_size = 512
    out = []
    for i in range(0, len(im_data), batch_size):
        batch = im_data[i : (i + batch_size)]
        out.append(model(batch))

    return tuple(torch.cat(v, dim=0) for v in zip(*out))


def detect_face(imgs, minsize, pnet, rnet, onet, threshold, factor):
    """Detect face."""
    if isinstance(imgs, (np.ndarray, torch.Tensor)):
        if isinstance(imgs, np.ndarray):
            imgs = torch.as_tensor(imgs.copy(), device=device)

        if isinstance(imgs, torch.Tensor):
            imgs = torch.as_tensor(imgs, device=device)

        if len(imgs.shape) == 3:
            imgs = imgs.unsqueeze(0)
    else:
        imgs = [imgs]
        imgs = np.stack([np.uint8(img) for img in imgs])
        imgs = torch.as_tensor(imgs.copy(), device=device)

    model_dtype = next(pnet.parameters()).dtype
    imgs = imgs.permute(0, 3, 1, 2).type(model_dtype)

    batch_size = len(imgs)
    h, w = imgs.shape[2:4]
    m = 12.0 / minsize
    minl = min(h, w)
    minl = minl * m

    scale_i = m
    scales = []
    while minl >= 12:
        scales.append(scale_i)
        scale_i = scale_i * factor
        minl = minl * factor

    boxes = []
    image_inds = []

    scale_picks = []

    offset = 0
    for scale in scales:
        im_data = imresample(imgs, (int(h * scale + 1), int(w * scale + 1)))
        im_data = (im_data - 127.5) * 0.0078125
        reg, probs = pnet(im_data)

        boxes_scale, image_inds_scale = generateBoundingBox(
            reg, probs[:, 1], scale, threshold[0]
        )
        boxes.append(boxes_scale)
        image_inds.append(image_inds_scale)

        pick = batched_nms(boxes_scale[:, :4], boxes_scale[:, 4], image_inds_scale, 0.5)
        scale_picks.append(pick + offset)
        offset += boxes_scale.shape[0]

    boxes = torch.cat(boxes, dim=0)
    image_inds = torch.cat(image_inds, dim=0)

    scale_picks = torch.cat(scale_picks, dim=0)
    boxes, image_inds = boxes[scale_picks], image_inds[scale_picks]

    pick = batched_nms(boxes[:, :4], boxes[:, 4], image_inds, 0.7)
    boxes, image_inds = boxes[pick], image_inds[pick]

    regw = boxes[:, 2] - boxes[:, 0]
    regh = boxes[:, 3] - boxes[:, 1]
    qq1 = boxes[:, 0] + boxes[:, 5] * regw
    qq2 = boxes[:, 1] + boxes[:, 6] * regh
    qq3 = boxes[:, 2] + boxes[:, 7] * regw
    qq4 = boxes[:, 3] + boxes[:, 8] * regh
    boxes = torch.stack([qq1, qq2, qq3, qq4, boxes[:, 4]]).permute(1, 0)
    boxes = rerec(boxes)
    y, ey, x, ex = pad(boxes, w, h)

    if len(boxes) > 0:
        im_data = []
        for k in range(len(y)):
            if ey[k] > (y[k] - 1) and ex[k] > (x[k] - 1):
                img_k = imgs[
                    image_inds[k], :, (y[k] - 1) : ey[k], (x[k] - 1) : ex[k]
                ].unsqueeze(0)
                im_data.append(imresample(img_k, (24, 24)))
        im_data = torch.cat(im_data, dim=0)
        im_data = (im_data - 127.5) * 0.0078125

        out = fixed_batch_process(im_data, rnet)
        out0 = out[0].permute(1, 0)
        out1 = out[1].permute(1, 0)
        score = out1[1, :]
        ipass = score > threshold[1]
        boxes = torch.cat((boxes[ipass, :4], score[ipass].unsqueeze(1)), dim=1)
        image_inds = image_inds[ipass]
        mv = out0[:, ipass].permute(1, 0)

        pick = batched_nms(boxes[:, :4], boxes[:, 4], image_inds, 0.7)
        boxes, image_inds, mv = boxes[pick], image_inds[pick], mv[pick]
        boxes = bbreg(boxes, mv)
        boxes = rerec(boxes)

    points = torch.zeros(0, 5, 2, device=device)
    if len(boxes) > 0:
        y, ey, x, ex = pad(boxes, w, h)
        im_data = []
        for k in range(len(y)):
            if ey[k] > (y[k] - 1) and ex[k] > (x[k] - 1):
                img_k = imgs[
                    image_inds[k], :, (y[k] - 1) : ey[k], (x[k] - 1) : ex[k]
                ].unsqueeze(0)
                im_data.append(imresample(img_k, (48, 48)))
        im_data = torch.cat(im_data, dim=0)
        im_data = (im_data - 127.5) * 0.0078125

        out = fixed_batch_process(im_data, onet)

        out0 = out[0].permute(1, 0)
        out1 = out[1].permute(1, 0)
        out2 = out[2].permute(1, 0)
        score = out2[1, :]
        points = out1
        ipass = score > threshold[2]
        points = points[:, ipass]
        boxes = torch.cat((boxes[ipass, :4], score[ipass].unsqueeze(1)), dim=1)
        image_inds = image_inds[ipass]
        mv = out0[:, ipass].permute(1, 0)

        w_i = boxes[:, 2] - boxes[:, 0] + 1
        h_i = boxes[:, 3] - boxes[:, 1] + 1
        points_x = w_i.repeat(5, 1) * points[:5, :] + boxes[:, 0].repeat(5, 1) - 1
        points_y = h_i.repeat(5, 1) * points[5:10, :] + boxes[:, 1].repeat(5, 1) - 1
        points = torch.stack((points_x, points_y)).permute(2, 1, 0)
        boxes = bbreg(boxes, mv)

        pick = batched_nms_numpy(boxes[:, :4], boxes[:, 4], image_inds, 0.7, "Min")
        boxes, image_inds, points = boxes[pick], image_inds[pick], points[pick]

    boxes = boxes.cpu().numpy()
    points = points.cpu().numpy()

    image_inds = image_inds.cpu()

    batch_boxes = []
    batch_points = []
    for b_i in range(batch_size):
        b_i_inds = np.where(image_inds == b_i)
        batch_boxes.append(boxes[b_i_inds].copy())
        batch_points.append(points[b_i_inds].copy())

    batch_boxes, batch_points = np.array(batch_boxes, dtype=object), np.array(
        batch_points, dtype=object
    )

    return batch_boxes, batch_points


def bbreg(boundingbox, reg):
    """BBREG."""
    if reg.shape[1] == 1:
        reg = torch.reshape(reg, (reg.shape[2], reg.shape[3]))

    w = boundingbox[:, 2] - boundingbox[:, 0] + 1
    h = boundingbox[:, 3] - boundingbox[:, 1] + 1
    b1 = boundingbox[:, 0] + reg[:, 0] * w
    b2 = boundingbox[:, 1] + reg[:, 1] * h
    b3 = boundingbox[:, 2] + reg[:, 2] * w
    b4 = boundingbox[:, 3] + reg[:, 3] * h
    boundingbox[:, :4] = torch.stack([b1, b2, b3, b4]).permute(1, 0)

    return boundingbox


def generateBoundingBox(reg, probs, scale, thresh):
    """Generate bounding box."""
    stride = 2
    cellsize = 12

    reg = reg.permute(1, 0, 2, 3)

    mask = probs >= thresh
    mask_inds = mask.nonzero()
    image_inds = mask_inds[:, 0]
    score = probs[mask]
    reg = reg[:, mask].permute(1, 0)
    bb = mask_inds[:, 1:].type(reg.dtype).flip(1)
    q1 = ((stride * bb + 1) / scale).floor()
    q2 = ((stride * bb + cellsize - 1 + 1) / scale).floor()
    boundingbox = torch.cat([q1, q2, score.unsqueeze(1), reg], dim=1)
    return boundingbox, image_inds


def nms_numpy(boxes, scores, threshold, method):
    """NMS numpy."""
    if boxes.size == 0:
        return np.empty((0, 3))

    x1 = boxes[:, 0].copy()
    y1 = boxes[:, 1].copy()
    x2 = boxes[:, 2].copy()
    y2 = boxes[:, 3].copy()
    s = scores
    area = (x2 - x1 + 1) * (y2 - y1 + 1)

    I = np.argsort(s)
    pick = np.zeros_like(s, dtype=np.int16)
    counter = 0
    while I.size > 0:
        i = I[-1]
        pick[counter] = i
        counter += 1
        idx = I[0:-1]

        xx1 = np.maximum(x1[i], x1[idx]).copy()
        yy1 = np.maximum(y1[i], y1[idx]).copy()
        xx2 = np.minimum(x2[i], x2[idx]).copy()
        yy2 = np.minimum(y2[i], y2[idx]).copy()

        w = np.maximum(0.0, xx2 - xx1 + 1).copy()
        h = np.maximum(0.0, yy2 - yy1 + 1).copy()

        inter = w * h
        if method == "Min":
            o = inter / np.minimum(area[i], area[idx])
        else:
            o = inter / (area[i] + area[idx] - inter)
        I = I[np.where(o <= threshold)]

    pick = pick[:counter].copy()
    return pick


def batched_nms_numpy(boxes, scores, idxs, threshold, method):
    """Batched NMS numpy."""
    device = boxes.device
    if boxes.numel() == 0:
        return torch.empty((0,), dtype=torch.int64, device=device)
    max_coordinate = boxes.max()
    offsets = idxs.to(boxes) * (max_coordinate + 1)
    boxes_for_nms = boxes + offsets[:, None]
    boxes_for_nms = boxes_for_nms.cpu().numpy()
    scores = scores.cpu().numpy()
    keep = nms_numpy(boxes_for_nms, scores, threshold, method)
    return torch.as_tensor(keep, dtype=torch.long, device=device)


def pad(boxes, w, h):
    """Pad."""
    boxes = boxes.trunc().int().cpu().numpy()
    x = boxes[:, 0]
    y = boxes[:, 1]
    ex = boxes[:, 2]
    ey = boxes[:, 3]

    x[x < 1] = 1
    y[y < 1] = 1
    ex[ex > w] = w
    ey[ey > h] = h

    return y, ey, x, ex


def rerec(bboxA):
    """Rerec."""
    h = bboxA[:, 3] - bboxA[:, 1]
    w = bboxA[:, 2] - bboxA[:, 0]

    l = torch.max(w, h)
    bboxA[:, 0] = bboxA[:, 0] + w * 0.5 - l * 0.5
    bboxA[:, 1] = bboxA[:, 1] + h * 0.5 - l * 0.5
    bboxA[:, 2:4] = bboxA[:, :2] + l.repeat(2, 1).permute(1, 0)

    return bboxA


def imresample(img, sz):
    """Imresample."""
    im_data = interpolate(img, size=sz, mode="area")
    return im_data


def crop_resize(img, box, image_size):
    """Crop resize."""
    if isinstance(img, np.ndarray):
        img = img[box[1] : box[3], box[0] : box[2]]
        out = cv2.resize(
            img, (image_size, image_size), interpolation=cv2.INTER_AREA
        ).copy()
    elif isinstance(img, torch.Tensor):
        img = img[box[1] : box[3], box[0] : box[2]]
        out = (
            imresample(
                img.permute(2, 0, 1).unsqueeze(0).float(), (image_size, image_size)
            )
            .byte()
            .squeeze(0)
            .permute(1, 2, 0)
        )
    else:
        out = img.crop(box).copy().resize((image_size, image_size), Image.BILINEAR)
    return out


def get_size(img):
    """Get size."""
    if isinstance(img, (np.ndarray, torch.Tensor)):
        return img.shape[1::-1]
    else:
        return img.size


def extract_face(img, box, image_size=160, margin=0):
    """Extract face."""
    margin = [
        margin * (box[2] - box[0]) / (image_size - margin),
        margin * (box[3] - box[1]) / (image_size - margin),
    ]
    raw_image_size = get_size(img)
    box = [
        int(max(box[0] - margin[0] / 2, 0)),
        int(max(box[1] - margin[1] / 2, 0)),
        int(min(box[2] + margin[0] / 2, raw_image_size[0])),
        int(min(box[3] + margin[1] / 2, raw_image_size[1])),
    ]

    face = crop_resize(img, box, image_size)
    face = transforms.functional.to_tensor(np.float32(face))

    return face


weights_path = os.path.join("predict", "weights")
onet_weight_path = os.path.join(settings.BASE_DIR, weights_path, "onet.pt")
pnet_weight_path = os.path.join(settings.BASE_DIR, weights_path, "pnet.pt")
rnet_weight_path = os.path.join(settings.BASE_DIR, weights_path, "rnet.pt")


class PNet(nn.Module):
    """PNet."""

    def __init__(self, weight_path=pnet_weight_path):
        """Init."""
        super().__init__()

        self.conv1 = nn.Conv2d(3, 10, kernel_size=3)
        self.prelu1 = nn.PReLU(10)
        self.pool1 = nn.MaxPool2d(2, 2, ceil_mode=True)
        self.conv2 = nn.Conv2d(10, 16, kernel_size=3)
        self.prelu2 = nn.PReLU(16)
        self.conv3 = nn.Conv2d(16, 32, kernel_size=3)
        self.prelu3 = nn.PReLU(32)
        self.conv4_1 = nn.Conv2d(32, 2, kernel_size=1)
        self.softmax4_1 = nn.Softmax(dim=1)
        self.conv4_2 = nn.Conv2d(32, 4, kernel_size=1)
        self.training = False
        state_dict = torch.load(weight_path, weights_only=True)
        self.load_state_dict(state_dict)

    def forward(self, x):
        """Forward."""
        x = self.conv1(x)
        x = self.prelu1(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.prelu2(x)
        x = self.conv3(x)
        x = self.prelu3(x)
        a = self.conv4_1(x)
        a = self.softmax4_1(a)
        b = self.conv4_2(x)
        return b, a


class RNet(nn.Module):
    """RNet."""

    def __init__(self, weight_path=rnet_weight_path):
        """Init."""
        super().__init__()

        self.conv1 = nn.Conv2d(3, 28, kernel_size=3)
        self.prelu1 = nn.PReLU(28)
        self.pool1 = nn.MaxPool2d(3, 2, ceil_mode=True)
        self.conv2 = nn.Conv2d(28, 48, kernel_size=3)
        self.prelu2 = nn.PReLU(48)
        self.pool2 = nn.MaxPool2d(3, 2, ceil_mode=True)
        self.conv3 = nn.Conv2d(48, 64, kernel_size=2)
        self.prelu3 = nn.PReLU(64)
        self.dense4 = nn.Linear(576, 128)
        self.prelu4 = nn.PReLU(128)
        self.dense5_1 = nn.Linear(128, 2)
        self.softmax5_1 = nn.Softmax(dim=1)
        self.dense5_2 = nn.Linear(128, 4)
        self.training = False
        state_dict = torch.load(weight_path, weights_only=True)
        self.load_state_dict(state_dict)

    def forward(self, x):
        """Forward."""
        x = self.conv1(x)
        x = self.prelu1(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.prelu2(x)
        x = self.pool2(x)
        x = self.conv3(x)
        x = self.prelu3(x)
        x = x.permute(0, 3, 2, 1).contiguous()
        x = self.dense4(x.view(x.shape[0], -1))
        x = self.prelu4(x)
        a = self.dense5_1(x)
        a = self.softmax5_1(a)
        b = self.dense5_2(x)
        return b, a


class ONet(nn.Module):
    """ONet."""

    def __init__(self, weight_path=onet_weight_path):
        """Init."""
        super().__init__()

        self.conv1 = nn.Conv2d(3, 32, kernel_size=3)
        self.prelu1 = nn.PReLU(32)
        self.pool1 = nn.MaxPool2d(3, 2, ceil_mode=True)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)
        self.prelu2 = nn.PReLU(64)
        self.pool2 = nn.MaxPool2d(3, 2, ceil_mode=True)
        self.conv3 = nn.Conv2d(64, 64, kernel_size=3)
        self.prelu3 = nn.PReLU(64)
        self.pool3 = nn.MaxPool2d(2, 2, ceil_mode=True)
        self.conv4 = nn.Conv2d(64, 128, kernel_size=2)
        self.prelu4 = nn.PReLU(128)
        self.dense5 = nn.Linear(1152, 256)
        self.prelu5 = nn.PReLU(256)
        self.dense6_1 = nn.Linear(256, 2)
        self.softmax6_1 = nn.Softmax(dim=1)
        self.dense6_2 = nn.Linear(256, 4)
        self.dense6_3 = nn.Linear(256, 10)
        self.training = False
        state_dict = torch.load(weight_path, weights_only=True)
        self.load_state_dict(state_dict)

    def forward(self, x):
        """Forward."""
        x = self.conv1(x)
        x = self.prelu1(x)
        x = self.pool1(x)
        x = self.conv2(x)
        x = self.prelu2(x)
        x = self.pool2(x)
        x = self.conv3(x)
        x = self.prelu3(x)
        x = self.pool3(x)
        x = self.conv4(x)
        x = self.prelu4(x)
        x = x.permute(0, 3, 2, 1).contiguous()
        x = self.dense5(x.view(x.shape[0], -1))
        x = self.prelu5(x)
        a = self.dense6_1(x)
        a = self.softmax6_1(a)
        b = self.dense6_2(x)
        c = self.dense6_3(x)
        return b, c, a


class MTCNN(nn.Module):
    """MTCNN."""

    def __init__(
        self,
        image_size=160,
        margin=0,
        min_face_size=20,
        thresholds=[0.6, 0.7, 0.7],
        factor=0.709,
        post_process=True,
        select_largest=True,
        selection_method=None,
        keep_all=False,
    ):
        """Init."""
        super().__init__()

        self.image_size = image_size
        self.margin = margin
        self.min_face_size = min_face_size
        self.thresholds = thresholds
        self.factor = factor
        self.post_process = post_process
        self.select_largest = select_largest
        self.keep_all = keep_all
        self.selection_method = selection_method

        self.pnet = PNet()
        self.rnet = RNet()
        self.onet = ONet()
        self.to(device)

        if not self.selection_method:
            self.selection_method = "largest" if self.select_largest else "probability"

    def forward(self, img, save_path=None, return_prob=False):
        """Forward."""
        batch_boxes, batch_probs, batch_points = self.detect(img, landmarks=True)
        if not self.keep_all:
            batch_boxes, batch_probs, batch_points = self.select_boxes(
                batch_boxes,
                batch_probs,
                batch_points,
                img,
                method=self.selection_method,
            )
        faces = self.extract(img, batch_boxes, save_path)

        if return_prob:
            return faces, batch_probs
        else:
            return faces

    def detect(self, img, landmarks=False):
        """Detect."""
        with torch.no_grad():
            batch_boxes, batch_points = detect_face(
                img,
                self.min_face_size,
                self.pnet,
                self.rnet,
                self.onet,
                self.thresholds,
                self.factor,
            )

        boxes, probs, points = [], [], []
        for box, point in zip(batch_boxes, batch_points):
            box = np.array(box)
            point = np.array(point)
            if len(box) == 0:
                boxes.append(None)
                probs.append([None])
                points.append(None)
            elif self.select_largest:
                box_order = np.argsort(
                    (box[:, 2] - box[:, 0]) * (box[:, 3] - box[:, 1])
                )[::-1]
                box = box[box_order]
                point = point[box_order]
                boxes.append(box[:, :4])
                probs.append(box[:, 4])
                points.append(point)
            else:
                boxes.append(box[:, :4])
                probs.append(box[:, 4])
                points.append(point)
        boxes = np.array(boxes, dtype=object)
        probs = np.array(probs, dtype=object)
        points = np.array(points, dtype=object)

        if (
            not isinstance(img, (list, tuple))
            and not (isinstance(img, np.ndarray) and len(img.shape) == 4)
            and not (isinstance(img, torch.Tensor) and len(img.shape) == 4)
        ):
            boxes = boxes[0]
            probs = probs[0]
            points = points[0]

        if landmarks:
            return boxes, probs, points

        return boxes, probs

    def select_boxes(
        self,
        all_boxes,
        all_probs,
        all_points,
        imgs,
        method="probability",
        threshold=0.9,
        center_weight=2.0,
    ):
        """Select boxes."""
        batch_mode = True
        if (
            not isinstance(imgs, (list, tuple))
            and not (isinstance(imgs, np.ndarray) and len(imgs.shape) == 4)
            and not (isinstance(imgs, torch.Tensor) and len(imgs.shape) == 4)
        ):
            imgs = [imgs]
            all_boxes = [all_boxes]
            all_probs = [all_probs]
            all_points = [all_points]
            batch_mode = False

        selected_boxes, selected_probs, selected_points = [], [], []
        for boxes, points, probs, img in zip(all_boxes, all_points, all_probs, imgs):

            if boxes is None:
                selected_boxes.append(None)
                selected_probs.append([None])
                selected_points.append(None)
                continue

            boxes = np.array(boxes)
            probs = np.array(probs)
            points = np.array(points)

            if method == "largest":
                box_order = np.argsort(
                    (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
                )[::-1]
            elif method == "probability":
                box_order = np.argsort(probs)[::-1]
            elif method == "center_weighted_size":
                box_sizes = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
                img_center = (img.width / 2, img.height / 2)
                box_centers = np.array(
                    list(
                        zip(
                            (boxes[:, 0] + boxes[:, 2]) / 2,
                            (boxes[:, 1] + boxes[:, 3]) / 2,
                        )
                    )
                )
                offsets = box_centers - img_center
                offset_dist_squared = np.sum(np.power(offsets, 2.0), 1)
                box_order = np.argsort(box_sizes - offset_dist_squared * center_weight)[
                    ::-1
                ]
            elif method == "largest_over_threshold":
                box_mask = probs > threshold
                boxes = boxes[box_mask]
                box_order = np.argsort(
                    (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
                )[::-1]
                if sum(box_mask) == 0:
                    selected_boxes.append(None)
                    selected_probs.append([None])
                    selected_points.append(None)
                    continue

            box = boxes[box_order][[0]]
            prob = probs[box_order][[0]]
            point = points[box_order][[0]]
            selected_boxes.append(box)
            selected_probs.append(prob)
            selected_points.append(point)

        if batch_mode:
            selected_boxes = np.array(selected_boxes)
            selected_probs = np.array(selected_probs)
            selected_points = np.array(selected_points)
        else:
            selected_boxes = selected_boxes[0]
            selected_probs = selected_probs[0][0]
            selected_points = selected_points[0]

        return selected_boxes, selected_probs, selected_points

    def extract(self, img, batch_boxes, save_path):
        """Extract."""
        batch_mode = True
        if (
            not isinstance(img, (list, tuple))
            and not (isinstance(img, np.ndarray) and len(img.shape) == 4)
            and not (isinstance(img, torch.Tensor) and len(img.shape) == 4)
        ):
            img = [img]
            batch_boxes = [batch_boxes]
            batch_mode = False

        if save_path is not None:
            if isinstance(save_path, str):
                save_path = [save_path]
        else:
            save_path = [None for _ in range(len(img))]

        faces = []
        for im, box_im, path_im in zip(img, batch_boxes, save_path):
            if box_im is None:
                faces.append(None)
                continue

            if not self.keep_all:
                box_im = box_im[[0]]

            faces_im = []
            for i, box in enumerate(box_im):
                face_path = path_im
                if path_im is not None and i > 0:
                    save_name, ext = os.path.splitext(path_im)
                    face_path = save_name + "_" + str(i + 1) + ext

                face = extract_face(im, box, self.image_size, self.margin, face_path)
                if self.post_process:
                    face = fixed_image_standardization(face)
                faces_im.append(face)

            if self.keep_all:
                faces_im = torch.stack(faces_im)
            else:
                faces_im = faces_im[0]

            faces.append(faces_im)

        if not batch_mode:
            faces = faces[0]

        return faces


def fixed_image_standardization(image_tensor):
    """Fixed image standardization."""
    processed_tensor = (image_tensor - 127.5) / 128.0
    return processed_tensor


def prewhiten(x):
    """Prewhiten."""
    mean = x.mean()
    std = x.std()
    std_adj = std.clamp(min=1.0 / (float(x.numel()) ** 0.5))
    y = (x - mean) / std_adj
    return y


class GenderClassificationModel(nn.Module):
    """Gender classification model."""

    def __init__(self):
        """Init."""
        super().__init__()
        self.conv_1_1 = nn.Conv2d(3, 64, 3, stride=1, padding=1)
        self.conv_1_2 = nn.Conv2d(64, 64, 3, stride=1, padding=1)
        self.conv_2_1 = nn.Conv2d(64, 128, 3, stride=1, padding=1)
        self.conv_2_2 = nn.Conv2d(128, 128, 3, stride=1, padding=1)
        self.conv_3_1 = nn.Conv2d(128, 256, 3, stride=1, padding=1)
        self.conv_3_2 = nn.Conv2d(256, 256, 3, stride=1, padding=1)
        self.conv_3_3 = nn.Conv2d(256, 256, 3, stride=1, padding=1)
        self.conv_4_1 = nn.Conv2d(256, 512, 3, stride=1, padding=1)
        self.conv_4_2 = nn.Conv2d(512, 512, 3, stride=1, padding=1)
        self.conv_4_3 = nn.Conv2d(512, 512, 3, stride=1, padding=1)
        self.conv_5_1 = nn.Conv2d(512, 512, 3, stride=1, padding=1)
        self.conv_5_2 = nn.Conv2d(512, 512, 3, stride=1, padding=1)
        self.conv_5_3 = nn.Conv2d(512, 512, 3, stride=1, padding=1)
        self.fc6 = nn.Linear(2048, 4096)
        self.fc7 = nn.Linear(4096, 4096)
        self.fc8 = nn.Linear(4096, 1)

    def forward(self, x):
        """Forward."""
        x = nn.functional.relu(self.conv_1_1(x))
        x = nn.functional.relu(self.conv_1_2(x))
        x = nn.functional.max_pool2d(x, 2, 2)
        x = nn.functional.relu(self.conv_2_1(x))
        x = nn.functional.relu(self.conv_2_2(x))
        x = nn.functional.max_pool2d(x, 2, 2)
        x = nn.functional.relu(self.conv_3_1(x))
        x = nn.functional.relu(self.conv_3_2(x))
        x = nn.functional.relu(self.conv_3_3(x))
        x = nn.functional.max_pool2d(x, 2, 2)
        x = nn.functional.relu(self.conv_4_1(x))
        x = nn.functional.relu(self.conv_4_2(x))
        x = nn.functional.relu(self.conv_4_3(x))
        x = nn.functional.max_pool2d(x, 2, 2)
        x = nn.functional.relu(self.conv_5_1(x))
        x = nn.functional.relu(self.conv_5_2(x))
        x = nn.functional.relu(self.conv_5_3(x))
        x = nn.functional.max_pool2d(x, 2, 2)
        x = x.view(x.size(0), -1)
        x = nn.functional.relu(self.fc6(x))
        x = nn.functional.dropout(x, 0.5, self.training)
        x = nn.functional.relu(self.fc7(x))
        x = nn.functional.dropout(x, 0.5, self.training)
        return nn.functional.sigmoid(self.fc8(x))


class AgeRangeModel(nn.Module):
    """Age range model."""

    def __init__(
        self, in_channels=3, backbone="resnet50", pretrained=False, num_classes=9
    ):
        """Init."""
        super().__init__()

        self.Conv1 = nn.Sequential(
            nn.Conv2d(in_channels, 64, 3, 1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.Conv2 = nn.Sequential(
            nn.Conv2d(64, 256, 3, 1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.Conv3 = nn.Sequential(
            nn.Conv2d(256, 512, 3, 1, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.adap = nn.AdaptiveAvgPool2d((2, 2))

        self.out_age = nn.Sequential(nn.Linear(2048, num_classes))

    def forward(self, x):
        """Forward."""
        batch_size = x.shape[0]
        x = self.Conv1(x)
        x = self.Conv2(x)
        x = self.Conv3(x)

        x = self.adap(x)

        x = x.view(batch_size, -1)

        x = self.out_age(x)

        return x


class AgeEstimationModel(nn.Module):
    """Age estimation model."""

    def __init__(self):
        """Init."""
        super().__init__()
        self.embedding_layer = nn.Embedding(9, 64)

        self.Conv1 = nn.Sequential(
            nn.Conv2d(3, 64, 3, 1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.Conv2 = nn.Sequential(
            nn.Conv2d(64, 256, 3, 1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.Conv3 = nn.Sequential(
            nn.Conv2d(256, 512, 3, 1, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.Dropout2d(0.3),
            nn.MaxPool2d(2),
        )

        self.adap = nn.AdaptiveAvgPool2d((2, 2))

        self.out_age = nn.Sequential(nn.Linear(2048 + 64, 1), nn.ReLU())

    def forward(self, x, y):
        """Forward."""
        batch_size = x.shape[0]
        x = self.Conv1(x)
        x = self.Conv2(x)
        x = self.Conv3(x)

        x = self.adap(x)

        x = x.view(batch_size, -1)

        y = self.embedding_layer(y)

        x = torch.cat([x, y], dim=1)

        x = self.out_age(x)

        return x


class Model(nn.Module):
    """Model."""

    def __init__(self):
        """Init."""
        super().__init__()

        self.gender_model = GenderClassificationModel()

        self.age_range_model = AgeRangeModel()

        self.age_estimation_model = AgeEstimationModel()

    def forward(self, x):
        """Forward."""
        if len(x.shape) == 3:
            x = x[None, ...]

        predicted_genders = self.gender_model(x)

        age_ranges = self.age_range_model(x)

        y = torch.argmax(age_ranges, dim=1).view(
            -1,
        )

        estimated_ages = self.age_estimation_model(x, y)

        return predicted_genders, estimated_ages


class AgeEstimator:
    """Age estimator."""

    def __init__(self, face_size=64, weight_path=None, tpx=500):
        """Init."""
        self.thickness_per_pixels = tpx
        self.face_size = (face_size, face_size)
        self.facenet_model = MTCNN()

        self.model = Model().to(device)
        self.model.eval()
        if weight_path:
            self.model.load_state_dict(
                torch.load(weight_path, weights_only=True, map_location=device)
            )

    def transform(self, image):
        """Transform."""
        return transforms.Compose(
            [
                transforms.Resize(self.face_size),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
            ]
        )(image)

    @staticmethod
    def plot_box_and_label(
        image, lw, box, label="", color=(128, 128, 128), txt_color=(255, 255, 255)
    ):
        """Plot box and label."""
        p1, p2 = (int(box[0]), int(box[1])), (int(box[2]), int(box[3]))
        cv2.rectangle(image, p1, p2, color, thickness=lw, lineType=cv2.LINE_AA)
        if label:
            tf = max(lw - 1, 1)
            w, h = cv2.getTextSize(label, 0, fontScale=lw / 3, thickness=tf)[0]
            outside = p1[1] - h - 3 >= 0
            p2 = p1[0] + w, p1[1] - h - 3 if outside else p1[1] + h + 3
            cv2.rectangle(image, p1, p2, color, -1, cv2.LINE_AA)
            cv2.putText(
                image,
                label,
                (p1[0], p1[1] - 2 if outside else p1[1] + h + 2),
                0,
                lw / 3,
                txt_color,
                thickness=tf,
                lineType=cv2.LINE_AA,
            )

    def padding_face(self, box, padding=10, image_shape=None):
        """Padding face."""
        left = max(box[0] - padding, 0)
        top = max(box[1] - padding, 0)
        right = min(box[2] + padding, image_shape[1])
        bottom = min(box[3] + padding, image_shape[0])
        return [left, top, right, bottom]

    def predict(self, img_path, min_prob=0.9):
        """Predict."""
        image = Image.open(img_path)
        image = image.convert("RGB")

        ndarray_image = np.array(image)

        image_shape = ndarray_image.shape

        bboxes, prob = self.facenet_model.detect(image)
        bboxes = bboxes[prob > min_prob]

        face_images_to_predict = []
        face_images_to_save = []

        for box in bboxes:
            box = np.clip(box, 0, np.inf).astype(np.int32)

            padding = max(image_shape) * 5 / self.thickness_per_pixels

            padding = int(max(padding, 10))

            box = self.padding_face(box, padding, image_shape)

            face = image.crop(box)
            face_images_to_save.append(face)

            transformed_face = self.transform(face)
            face_images_to_predict.append(transformed_face)

        face_images_to_predict = torch.stack(face_images_to_predict, dim=0)

        face_images_to_predict = face_images_to_predict.to(device)

        genders, ages = self.model(face_images_to_predict)

        genders = torch.round(genders)

        ages = torch.round(ages).long()

        for i, box in enumerate(bboxes):
            box = np.clip(box, 0, np.inf).astype(np.uint32)

            thickness = max(image_shape) / 400

            thickness = int(max(np.ceil(thickness), 1))

            label = "WOMAN" if genders[i] else "MAN"
            label += f": {ages[i].item()}years old"
            self.plot_box_and_label(
                ndarray_image, thickness, box, label, color=(255, 0, 0)
            )

        func_to_item = lambda x: int(x.item())
        return ndarray_image, list(
            zip(
                face_images_to_save,
                list(map(func_to_item, genders)),
                list(map(func_to_item, ages)),
            )
        )


device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
face_age_net_weight_path = os.path.join(
    settings.BASE_DIR, weights_path, "face_age_net_weight.pt"
)
face_age_net = AgeEstimator(weight_path=face_age_net_weight_path)
print("Init Face Age Net Model Successfully.")
