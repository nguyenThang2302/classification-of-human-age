const Bull = require('bull');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { MediaService } = require('../services/index');
const config = require('./config');
const redis = require('./redis.config');
const _ = require('lodash');

cloudinary.config(config.cloudinary);

const imageUploadQueue = new Bull('imageUploadQueue', {
  redis: redis.redisConfig
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpeg', 'png', 'jpg'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

imageUploadQueue.process(async (job) => {
  const { originImage, userId, predictedImage, seperatedImages } = job.data;
  const base64Images = [];
  base64Images.push(originImage);
  base64Images.push(predictedImage);

  try {
    const uploadImages = [];
    for (const base64Image of base64Images) {
      const result = await cloudinary.uploader.upload(base64Image.base64_url, {
        resource_type: 'auto',
      });

      uploadImages.push(result.secure_url);
    }
    const images = {
      name: `${Date.now()}`,
      origin_url: uploadImages[0],
      predicted_url: uploadImages[1]
    };

    const imageDetails = [];
    for (const seperatedImage of seperatedImages) {
      const result = await cloudinary.uploader.upload(seperatedImage.base64_url, {
        resource_type: 'auto',
      });
      imageDetails.push({
        secure_url: result.secure_url,
        age: seperatedImage.age,
        gender: seperatedImage.gender
      })
    }
    await MediaService.insertImage(userId, images, imageDetails);
  } catch (error) {
    throw error;
  }
});

function addImageToQueue(req, res, next) {
  const response = req['res_load_model'];
  const originImage = response['origin_image'];
  const predictedImage = response['predicted_image'];
  const seperatedImages = response['seperated_images'];
  const jobData = {
    originImage,
    userId: req.user ? req.user.id : null,
    predictedImage,
    seperatedImages
  };
  imageUploadQueue.add(jobData);
}

module.exports = {
  storage,
  addImageToQueue
};
