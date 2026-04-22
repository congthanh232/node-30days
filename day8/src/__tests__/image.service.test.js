import { describe, it, expect } from 'vitest';
import { processImage } from '../services/image.service.js';
import fs from 'fs';
import path from 'path';

// đường dẫn tới file ảnh test thật
const testImagePath = 'uploads/originals/1776369343557-1011.png';
const testFilename = '1776369343557-1011.png';

describe('processImage()', () => {
  it('trả về outputName, width, height, size', async () => {
    const result = await processImage(testImagePath, testFilename);

    // phải có đủ 4 trường
    expect(result.outputName).toBeDefined();
    expect(result.width).toBeDefined();
    expect(result.height).toBeDefined();
    expect(result.size).toBeDefined();
  });

  it('output file phải là .webp', async () => {
    const result = await processImage(testImagePath, testFilename);

    expect(result.outputName).toMatch(/\.webp$/);
  });

  it('file output thật sự được tạo ra trên disk', async () => {
    const result = await processImage(testImagePath, testFilename);

    const outputPath = path.join('uploads/processed', result.outputName);
    // kiểm tra file có tồn tại không
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('width và height không vượt quá 800', async () => {
    const result = await processImage(testImagePath, testFilename);

    expect(result.width).toBeLessThanOrEqual(800);
    expect(result.height).toBeLessThanOrEqual(800);
  });
});