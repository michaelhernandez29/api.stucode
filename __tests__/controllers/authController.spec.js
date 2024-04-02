const request = require('supertest');

const app = require('../../src/api');

describe('authController', () => {
  describe('/v1/auth/login', () => {
    it('returns 200 when signin request is valid', (done) => {
      let data = {
        email: 'test@test.com',
        password: 'test',
      };

      request(app)
        .post('/v1/auth/login')
        .send(data)
        .then((response) => {
          expect(response.status).toBe(200);
          done();
        });
    });

    it('returns Ok when signin request is valid', (done) => {
      let data = {
        email: 'test@test.com',
        password: 'test',
      };

      request(app)
        .post('/v1/auth/login')
        .send(data)
        .then((response) => {
          expect(response.body.message).toBe('OK');
          done();
        });
    });

    it('returns data when signin request is valid', (done) => {
      let data = {
        email: 'test@test.com',
        password: 'test',
      };

      request(app)
        .post('/v1/auth/login')
        .send(data)
        .then((response) => {
          expect(response.body.data).not.toBeNull();
          done();
        });
    });
  });
});
