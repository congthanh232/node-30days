
import { describe, it, expect, beforeEach } from 'vitest';
import { register, login , resetUsers } from '../services/auth.service.js';

// beforeEach: chạy trước MỖI test
// Vì auth.service dùng mảng users[] trong bộ nhớ
// nếu không reset → test sau bị ảnh hưởng bởi test trước
beforeEach(async () => {
  resetUsers();
});

// describe: nhóm các test liên quan lại
describe('register()', () => {
  it('tạo user mới thành công', async () => {
    const user = await register({
      name: 'John',
      email: 'john@test.com',
      password: '123456'
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('john@test.com');
    // password phải được hash, không phải plain text
    expect(user.password).not.toBe('123456');
  });

  it('throw lỗi EMAIL_EXISTED nếu email trùng', async () => {
    await register({ name: 'John', email: 'dup@test.com', password: '123456' });

    // lần 2 cùng email → phải throw AppError
    await expect(
      register({ name: 'Jane', email: 'dup@test.com', password: '123456' })
    ).rejects.toMatchObject({
      code: 'EMAIL_EXISTED',
      status: 409
    });
  });
});

describe('login()', () => {
  it('trả về token nếu đúng email + password', async () => {
    await register({ name: 'John', email: 'login@test.com', password: '123456' });

    const token = await login({ email: 'login@test.com', password: '123456' });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('trả về null nếu email không tồn tại', async () => {
    const token = await login({ email: 'nobody@test.com', password: '123456' });
    expect(token).toBeNull();
  });

  it('trả về null nếu password sai', async () => {
    await register({ name: 'John', email: 'wrong@test.com', password: '123456' });

    const token = await login({ email: 'wrong@test.com', password: 'wrongpassword' });
    expect(token).toBeNull();
  });
});