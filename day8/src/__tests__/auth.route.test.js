// src/__tests__/auth.route.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { resetUsers } from '../services/auth.service.js';

beforeEach(() => {
  resetUsers();
});

describe('POST /api/v1/auth/register', () => {
  it('201 + trả về id và email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'john@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('email', 'john@test.com');
  });

  it('409 nếu email trùng', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'dup@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Jane', email: 'dup@test.com', password: '123456' });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_EXISTED');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('200 + trả về accessToken', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'john@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('200 + trả về accessToken và refreshToken nếu x-client: app', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'john@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('x-client', 'app')
      .send({ email: 'john@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('401 nếu password sai', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John', email: 'john@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });
});