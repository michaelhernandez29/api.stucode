const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const config = require('../../api/config');
const server = require('../../api/server');
const errorCodes = require('../../api/constants/errorCodes');
const errorMessages = require('../../api/constants/errorMessages');

const prisma = new PrismaClient();

let app = null;
beforeEach(async () => {
  app = server.listen(config.get('port'));
  await prisma.$connect();
});

describe('POST /user/register', () => {
  const completeBody = {
    name: 'test',
    email: 'test@test.com',
    password: 'test',
  };

  it("should respond with 200 OK if email doesn't exist", async () => {
    const response = await request(app).post('/v1/user/register').send(completeBody);

    expect(response.status).toBe(201);
    expect(response.body.statusCode).toBe(201);
    expect(response.body.message).toEqual('Created');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.name).toEqual(completeBody.name);
    expect(response.body.data.email).toEqual(completeBody.email);
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
    await request(app).post('/v1/user/register').send(completeBody);
    const response = await request(app).post('/v1/user/register').send(completeBody);

    expect(response.status).toBe(409);
    expect(response.body.statusCode).toBe(409);
    expect(response.body.message).toEqual(errorMessages.EMAIL_ALREADY_EXISTS);
    expect(response.body.errorCode).toEqual(errorCodes.CONFLICT);
  });
});

afterEach(async () => {
  app.close();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
