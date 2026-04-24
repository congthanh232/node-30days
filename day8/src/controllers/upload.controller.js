import { processImage } from '../services/image.service.js';
import AppError from '../errors/AppError.js';
import { sendSuccess } from '../utils/response.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError({
        code: 'NO_FILE',
        message: 'Chưa có file',
        status: 400
      }));
    }

    const result = await processImage(req.file.path, req.file.filename);

    sendSuccess(res, {
      status: 201,
      message: 'Upload hình ảnh thành công',
      data: {
        url: `/uploads/processed/${result.outputName}`,
        width: result.width,
        height: result.height,
        size: result.size
      }
    });
  } catch (err) {
    next(err);
  }
};