import { processImage } from '../services/image.service.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Chưa có file' });

    const result = await processImage(req.file.path, req.file.filename);

    res.status(201).json({
      url: `/uploads/processed/${result.outputName}`,
      width: result.width,
      height: result.height,
      size: result.size
    });
  } catch (err) {
    next(err);
  }
};