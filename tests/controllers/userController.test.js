const request = require('supertest');

const app = require('../../src/api');
const db = require('../../src/lib/db');

describe('userController', () => {
  let id = '7e260ebd-7a78-4584-bb97-d4bb650bc06d';
  let login;
  let data = {
    email: 'test@test.com',
    password: 'test',
  };

  beforeAll(async () => {
    login = await request(app).post('/v1/user/login').send(data);
    await db.authenticate();
  });

  afterAll(async () => {
    await db.close();
  });

  describe('GET /v1/user/{id}', () => {
    it('returns 200 when request is valid', async () => {
      const response = await request(app)
        .get(`/v1/user/${id}`)
        .set({
          Authorization: `Bearer ${login.body.data}`,
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toEqual('OK');
      expect(typeof response.body.data).toBe('object');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toEqual(id);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('logo');
    });

    it('returns 401 when request is unauthorized', async () => {
      const response = await request(app).get(`/v1/user/${id}`).set({
        Authorization: `Bearer test`,
      });

      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
    });

    it('returns 404 when user request is not found', async () => {
      const response = await request(app)
        .get(`/v1/user/7e260ebd-7a78-4584-bb97-d4bb650bc011`)
        .set({
          Authorization: `Bearer ${login.body.data}`,
        });

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBe('The user does not exist');
      expect(response.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
