const { AppDataSource } = require('../database/ormconfig');
const { MediaMapper } = require('../mappers/index');
const Image = require('../database/entities/image.entity');
const UserImage = require('../database/entities/user_image.entity');
const { ok } = require('../helpers/response.helper');
const config = require('../config/config');
const ImageDetails = require('../database/entities/image_details.entity');
const MediaService = module.exports;

const imageRepository = AppDataSource.getRepository(Image);
const userImageRepository = AppDataSource.getRepository(UserImage);
const imageDetailRepository = AppDataSource.getRepository(ImageDetails);

MediaService.insertImage = async (userID, images, imageDetails) => {
  try {
    const imageData = imageRepository.create(images);
    await imageRepository.save(imageData);

    const userImageData = userImageRepository.create({
      user_id: userID,
      image_id: imageData.id
    });
    await userImageRepository.save(userImageData);

    for (const imageDetail of imageDetails) {
      imageDetail['image_id'] = imageData.id;
      const imageDetailSave = imageDetailRepository.create(imageDetail);
      await imageDetailRepository.save(imageDetailSave);
    }
  } catch (error) {
    return next(error);
  }
};

MediaService.getImagesHistory = async (req, res, next) => {
  try {
    const { limit = 10, offset = 1 } = req.query;
    const userID = req.user['id'];
    const totalImages = await imageRepository
      .createQueryBuilder('images')
      .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID })
      .getCount();

    const images = await imageRepository.createQueryBuilder('images')
      .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID })
      .select()
      .orderBy('images.created_at', 'DESC')
      .limit(limit)
      .offset(limit * (offset - 1))
      .getMany();

    const totalPages = Math.ceil(totalImages / limit);
    const paginations = {
      total: images.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      current_page: parseInt(offset),
      total_page: totalPages,
      has_next_page: offset < totalPages,
      has_previous_page: offset > 1,
    };
    return ok(req, res, MediaMapper.toImagesHistoryResponse(images, paginations));
  } catch (error) {
    return next(error);
  }
};

MediaService.getImageDetail = async (req, res, next) => {
  try {
    const userID = req.user['id'];
    const imageID = parseInt(req.params.image_id);

    const imageDetail = await imageDetailRepository.createQueryBuilder('image_details')
      .innerJoin('image_details.image', 'images', 'images.id = :image_id', { image_id: imageID })
      .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID })
      .select()
      .where('image_details.image_id = :image_id', { image_id: imageID })
      .getMany();

    return ok(req, res, MediaMapper.toImageDetailResponse(imageDetail));
  } catch (error) {
    return next(error);
  }
};
