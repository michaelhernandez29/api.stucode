// const request = require('supertest');

// const app = require('../../src/api');

describe('authController', () => {
  describe('/v1/auth/login', () => {
    it('returns 200 when signin request is valid', async () => {
      // let data = {
      //   email: 'test@test.com',
      //   password: 'test',
      // };
      // const response = await request(app).post('/v1/auth/login').send(data);
      // expect(response.status).toBe(200);
    });

    it('returns Ok when signin request is valid', async () => {
      // let data = {
      //   email: 'test@test.com',
      //   password: 'test',
      // };
      // const response = await request(app).post('/v1/auth/login').send(data);
      // expect(response.body.message).toBe('OK');
    });

    it('returns data when signin request is valid', async () => {
      // let data = {
      //   email: 'test@test.com',
      //   password: 'test',
      // };
      // const response = await request(app).post('/v1/auth/login').send(data);
      // expect(response.body.data).not.toBeNull();
    });
  });
});
