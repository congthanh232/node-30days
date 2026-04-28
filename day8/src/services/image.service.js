import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const outputDir = 'uploads/processed';

await fs.mkdir(outputDir, { recursive: true });

export const processImage = async (filePath, filename) => {
  const outputName = `processed-${Date.now()}.webp`;
  const outputPath = path.join(outputDir, outputName);

  const info = await sharp(filePath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  await fs.unlink(filePath);

  return { outputName, width: info.width, height: info.height, size: info.size };
};
