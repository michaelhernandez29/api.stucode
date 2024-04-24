const request = require('supertest');

const app = require('../../src/api');
const db = require('../../src/lib/db');

describe('authController', () => {
  beforeAll(async () => {
    await db.authenticate();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('/v1/auth/login', () => {
    it('returns 200 when signin request is valid', async () => {
      let data = {
        email: 'test@test.com',
        password: 'test',
      };
      const response = await request(app).post('/v1/auth/login').send(data);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');
      expect(response.body.data).not.toBeNull();
    });
  });
});
