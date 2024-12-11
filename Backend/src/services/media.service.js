const { AppDataSource } = require('../database/ormconfig');
const { MediaMapper } = require('../mappers/index');
const Image = require('../database/entities/image.entity');
const UserImage = require('../database/entities/user_image.entity');
const {ok} = require('../helpers/response.helper');
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
    const images = await imageRepository.createQueryBuilder('images')
                      .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID})
                      .select()
                      .orderBy('images.created_at', 'DESC')
                      .limit(limit)
                      .offset(limit * (offset - 1))
                      .getMany();
    return ok(req, res, MediaMapper.toImagesHistoryResponse(images));
  } catch (error) {
    return next(error);
  }
};

MediaService.getImageDetail = async (req, res, next) => {
  try {
    const userID = req.user['id'];
    const imageID = parseInt(req.params.image_id);

    const imageDetail = await imageRepository.createQueryBuilder('images')
                          .innerJoin('images.user_images', 'user_images', 'user_images.user_id = :user_id', { user_id: userID})
                          .select([
                            'images.id as id',
                            'images.name as name',
                            'images.url as url',
                            'images.created_at as created_at'
                          ])
                          .where('images.id = :id', { id: imageID })
                          .getRawOne();

    return ok(req, res, MediaMapper.toImageDetailResponse(imageDetail));
  } catch (error) {
    return next(error);
  }
};
