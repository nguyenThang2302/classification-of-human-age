const Bull = require('bull');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { MediaService } = require('../services/index');
const config = require('./config');
const redis = require('./redis.config');

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
  const { file, userId, resultTrain } = job.data;

  try {
    const buffer = Buffer.from(file.buffer.data);

    const uploadStream = (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: file.originalname, resource_type: 'image' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      stream.end(buffer);
    };

    const result = await new Promise(uploadStream);
    await MediaService.insertImage(userId, result.secure_url, resultTrain);
  } catch (error) {
    throw error;
  }
});

function addImageToQueue(req, res, next) {
  const file = req.file;
  const result = req['prediction'].predicted_class;
  const jobData = {
    file,
    userId: req.user ? req.user.id : null,
    resultTrain: result
  };
  imageUploadQueue.add(jobData);
}

module.exports = {
  storage,
  addImageToQueue
};
