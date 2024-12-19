const { AppDataSource } = require('../database/ormconfig');
const { MediaMapper } = require('../mappers/index');
const Image = require('../database/entities/image.entity');
const UserImage = require('../database/entities/user_image.entity');
const { ok } = require('../helpers/response.helper');
const ImageDetails = require('../database/entities/image_details.entity');
const _ = require('lodash');
const { BadRequestError } = require('../errors');
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

MediaService.getSearchImagesHistory = async (req, res, next) => {
  const { limit = 10, offset = 1, email = '', date = '' } = req.query;
  let totalImages = 0;
  let images = [];
  const queryBuilder = imageRepository.createQueryBuilder('images')
    .innerJoin('images.user_images', 'user_images')
    .innerJoinAndSelect('user_images.user', 'users');

  if (!email && !date) {
    const totalImage = await queryBuilder.getCount();
    totalImages += totalImage;
    const imagesAll = await queryBuilder
      .orderBy('images.created_at', 'DESC')
      .limit(limit)
      .offset(limit * (offset - 1))
      .getMany();
    images.push(...imagesAll);
  }

  if (email && date) {
    const totalImageByEmailAndDate = await queryBuilder
      .andWhere('users.email = :email', { email })
      .andWhere('DATE(images.created_at) = :date', { date })
      .getCount();
    totalImages += totalImageByEmailAndDate;
    const imagesByEmailAndDate = await queryBuilder
      .andWhere('users.email = :email', { email })
      .andWhere('DATE(images.created_at) = :date', { date })
      .orderBy('images.created_at', 'DESC')
      .limit(limit)
      .offset(limit * (offset - 1))
      .getMany();
    images.push(...imagesByEmailAndDate);
  }

  if (email && !date) {
    const totalImageByEmail = await queryBuilder.andWhere('users.email = :email', { email }).getCount();
    totalImages += totalImageByEmail;
    const imagesByEmail = await queryBuilder.andWhere('users.email = :email', { email })
      .orderBy('images.created_at', 'DESC')
      .limit(limit)
      .offset(limit * (offset - 1))
      .getMany();
    images.push(...imagesByEmail);
  }

  if (date && !email) {
    const totalImageByDate = await queryBuilder.andWhere('DATE(images.created_at) = :date', { date }).getCount();
    totalImages += totalImageByDate;
    const imagesByDate = await queryBuilder.andWhere('DATE(images.created_at) = :date', { date })
      .orderBy('images.created_at', 'DESC')
      .limit(limit)
      .offset(limit * (offset - 1))
      .getMany();
    images.push(...imagesByDate);
  }

  const totalPages = Math.ceil((totalImages) / limit);
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
};

MediaService.adminGetImageDetails = async (req, res, next) => {
  try {
    const imageID = parseInt(req.params.image_id);
    const imageDetails = await imageDetailRepository.createQueryBuilder('image_details')
      .innerJoin('image_details.image', 'images', 'images.id = :image_id', { image_id: imageID })
      .select()
      .where('image_details.image_id = :image_id', { image_id: imageID })
      .andWhere('image_details.deleted_at IS NULL')
      .getMany();

    return ok(req, res, MediaMapper.toImageDetailResponse(imageDetails));
  } catch (error) {
    return next(error);
  }
};

MediaService.adminEditImageDetails = async (req, res, next) => {
  try {
    const { image_id, gender, age } = req.body;
    const imageDetailsID = parseInt(req.params.image_detail_id);
    const imageDetails = await imageDetailRepository.createQueryBuilder('image_details')
      .innerJoin('image_details.image', 'images', 'images.id = :image_id', { image_id })
      .select()
      .where('image_details.id = :image_details_id', { image_details_id: imageDetailsID })
      .getOne();

    if (!imageDetails) {
      return next(new BadRequestError('Image not found'));
    }

    await imageDetailRepository.update({ id: imageDetailsID }, {
      gender,
      age
    });
    return ok(req, res, MediaMapper.toEditImageDetailResponse());
  } catch (error) {
    return next(error);
  }
};


MediaService.getAgeFolders = async (req, res, next) => {
  try {
    const ageFolders = await imageDetailRepository.createQueryBuilder('image_details')
      .select('DISTINCT age')
      .orderBy('age', 'ASC')
      .getRawMany();
    return ok(req, res, MediaMapper.toAgeFoldersResponse(ageFolders));
  } catch (error) {
    return next(error);
  }
};

MediaService.getAgeImages = async (req, res, next) => {
  try {
    const { age } = req.query;
    const ageImages = await imageDetailRepository.createQueryBuilder('image_details')
      .innerJoin('image_details.image', 'images')
      .select()
      .where('image_details.age = :age', { age })
      .getMany();

    return ok(req, res, MediaMapper.toAgeImagesResponse(ageImages));
  } catch (error) {
    return next(error);
  }
};

MediaService.getGenderImages = async (req, res, next) => {
  try {
    const { gender } = req.query;
    const genderImages = await imageDetailRepository.createQueryBuilder('image_details')
      .innerJoin('image_details.image', 'images')
      .select()
      .where('image_details.gender = :gender', { gender })
      .getMany();

    return ok(req, res, MediaMapper.toGenderImagesResponse(genderImages));
  } catch (error) {
    return next(error);
  }
};

MediaService.deleteImageDetails = async (req, res, next) => {
  try {
    const imageDetailsID = parseInt(req.params.image_detail_id);
    const imageDetails = await imageDetailRepository.findOneBy({ id: imageDetailsID });
    if (!imageDetails) {
      return next(new BadRequestError('Image not found'));
    }

    await imageDetailRepository.update({ id: imageDetailsID }, {
      deleted_at: new Date()
    });
    return ok(req, res, MediaMapper.deleteImageDetails());
  } catch (error) {
    return next(error);
  }
};

MediaService.getTrashImageDetails = async (req, res, next) => {
  try {
    const { image_name } = req.query;
    let trashImageDetails;
    if (image_name === '') {
      trashImageDetails = await imageDetailRepository.createQueryBuilder('image_details')
        .select()
        .where('image_details.deleted_at IS NOT NULL')
        .getMany();
    } else {
      const image = await imageRepository.findOneBy({ name: image_name });
      if (!image) {
        return next(new BadRequestError('Image not found'));
      }
      trashImageDetails = await imageDetailRepository.createQueryBuilder('image_details')
        .select()
        .where('image_details.deleted_at IS NOT NULL')
        .andWhere('image_details.image_id = :image_id', { image_id: image.id })
        .getMany();
    }

    return ok(req, res, MediaMapper.toImageDetailResponse(trashImageDetails));
  } catch (error) {
    return next(error);
  }
};

MediaService.restoreImageDetails = async (req, res, next) => {
  try {
    const imageDetailsID = parseInt(req.params.image_detail_id);
    const imageDetails = await imageDetailRepository.findOneBy({ id: imageDetailsID });
    if (!imageDetails) {
      return next(new BadRequestError('Image not found'));
    }

    await imageDetailRepository.update({ id: imageDetailsID }, {
      deleted_at: null
    });
    return ok(req, res, MediaMapper.deleteImageDetails());
  } catch (error) {
    return next(error);
  }
};
