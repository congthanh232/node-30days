import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const outputDir = 'uploads/processed';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

export const processImage = async (filePath, filename) => {
  const outputName = `processed-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, outputName);

  const info = await sharp(filePath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return { outputName, width: info.width, height: info.height, size: info.size };
};
