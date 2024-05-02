const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const config = require('../../api/config');
const server = require('../../api/server');
const errorCodes = require('../../api/constants/errorCodes');
const errorMessages = require('../../api/constants/errorMessages');

const prisma = new PrismaClient();

let app = null;
const newUserCompleteBody = {
  name: 'test',
  email: 'test@test.com',
  password: 'test',
};
const userCompleteBody = { email: 'test@test.com', password: 'test' };

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany();
});

beforeEach(async () => {
  app = server.listen(config.get('port'));
});

describe('POST /user/register', () => {
  it("should respond with 201 Created if email doesn't exist", async () => {
    const response = await request(app).post('/v1/user/register').send(newUserCompleteBody);

    expect(response.status).toBe(201);
    expect(response.body.statusCode).toBe(201);
    expect(response.body.message).toEqual('Created');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toEqual(newUserCompleteBody.name);
    expect(response.body.data.email).toEqual(newUserCompleteBody.email);
  });

  it('should respond with 400 Bad Request if email format is not valid', async () => {
    const emailInvalidFormatBody = {
      name: 'test',
      email: 'test',
      password: 'test',
    };

    const response = await request(app).post('/v1/user/register').send(emailInvalidFormatBody);
    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(errorMessages.EMAIL_FORMAT_NOT_VALID);
    expect(response.body.errorCode).toEqual(errorCodes.BAD_REQUEST);
  });

  it('should respond with 409 Conflict if email already exists', async () => {
    await request(app).post('/v1/user/register').send(newUserCompleteBody);
    const response = await request(app).post('/v1/user/register').send(newUserCompleteBody);

    expect(response.status).toBe(409);
    expect(response.body.statusCode).toBe(409);
    expect(response.body.message).toEqual(errorMessages.EMAIL_ALREADY_EXISTS);
    expect(response.body.errorCode).toEqual(errorCodes.CONFLICT);
  });
});

describe('POST /user/login', () => {
  it('should respond with 200 OK if user has logged correctly', async () => {
    await request(app).post('/v1/user/register').send(newUserCompleteBody);
    const response = await request(app).post('/v1/user/login').send(userCompleteBody);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
  });

  it('should respond with 400 Bad Request if credentials are not valid', async () => {
    const data = {
      email: 'test@test.com',
      password: 'test1',
    };

    await request(app).post('/v1/user/register').send(newUserCompleteBody);

    const response = await request(app).post('/v1/user/login').send(data);
    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(errorMessages.PASSWORD_NOT_VALID);
    expect(response.body.errorCode).toEqual(errorCodes.BAD_REQUEST);
  });

  it('should respond with 400 Bad Request if email format is not valid', async () => {
    const data = {
      email: 'test',
      password: 'test1',
    };

    await request(app).post('/v1/user/register').send(newUserCompleteBody);

    const response = await request(app).post('/v1/user/login').send(data);
    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(errorMessages.EMAIL_FORMAT_NOT_VALID);
    expect(response.body.errorCode).toEqual(errorCodes.BAD_REQUEST);
  });

  it("should respond with 404 Not Found if email doesn't exist", async () => {
    const data = {
      email: 'test@test.com',
      password: 'test1',
    };

    const response = await request(app).post('/v1/user/login').send(data);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  });
});

describe('GET /user', () => {
  it('should respond with 200 OK with count N if there are N users in the system', async () => {
    await request(app).post('/v1/user/register').send(newUserCompleteBody);
    await request(app).post('/v1/user/register').send({
      name: 'test',
      email: 'test1@test.com',
      password: 'test',
    });

    const response = await request(app).get('/v1/user');

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('count');
    expect(response.body.data.length).toEqual(2);
    expect(response.body.count).toEqual(2);
  });

  it('should respond with 200 OK with count 0 if there are not users in the system', async () => {
    const response = await request(app).get('/v1/user');

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('count');
    expect(response.body.data.length).toEqual(0);
    expect(response.body.count).toEqual(0);
  });
});

describe('GET /user/{id}', () => {
  it('should respond with 200 OK if the user exists', async () => {
    const user = await request(app).post('/v1/user/register').send(newUserCompleteBody);

    const response = await request(app).get(`/v1/user/${user.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toEqual(newUserCompleteBody.name);
    expect(response.body.data.email).toEqual(newUserCompleteBody.email);
  });

  it("should respond with 404 Not Found if the user doesn't exist", async () => {
    const id = '11111111-1111-1111-1111-111111111111';

    const response = await request(app).get(`/v1/user/${id}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  });
});

describe('PUT /user/{id}', () => {
  const newUserData = {
    name: 'New name',
    jobTitle: 'New jobTitle',
    biography: 'New biography',
    logo: 'New logo',
  };

  it('should respond with 200 OK if the udpate was successful', async () => {
    const user = await request(app).post('/v1/user/register').send(newUserCompleteBody);
    const response = await request(app).put(`/v1/user/${user.body.data.id}`).send(newUserData);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toEqual(newUserData.name);
    expect(response.body.data.jobTitle).toEqual(newUserData.jobTitle);
    expect(response.body.data.biography).toEqual(newUserData.biography);
    expect(response.body.data.logo).toEqual(newUserData.logo);
  });

  it("should respond with 404 Not Found if the user doesn't exist", async () => {
    const id = '11111111-1111-1111-1111-111111111111';

    const response = await request(app).put(`/v1/user/${id}`).send(newUserData);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  });
});

describe('DELETE /user/{id}', () => {
  it('should respond with 200 OK if the user was deleted', async () => {
    const user = await request(app).post('/v1/user/register').send(newUserCompleteBody);
    const response = await request(app).delete(`/v1/user/${user.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
  });

  it("should respond with 404 Not Found if the user doesn't exist", async () => {
    const id = '11111111-1111-1111-1111-111111111111';

    const response = await request(app).delete(`/v1/user/${id}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  });
});

afterEach(async () => {
  app.close();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

afterAll(async () => {
  app.close();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
