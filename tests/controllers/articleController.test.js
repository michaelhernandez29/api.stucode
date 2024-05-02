const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const config = require('../../api/config');
const server = require('../../api/server');
const errorCodes = require('../../api/constants/errorCodes');
const errorMessages = require('../../api/constants/errorMessages');

const prisma = new PrismaClient();

let app = null;
const userCompleteBody = {
  name: 'test',
  email: 'test@test.com',
  password: 'test',
};

beforeAll(async () => {
  await prisma.$connect();
  await prisma.article.deleteMany();
});

beforeEach(async () => {
  app = server.listen(config.get('port'));
  await prisma.$connect();
});

const getArticleData = (userId = null) => {
  return {
    userId: userId ?? '11111111-1111-1111-1111-111111111111',
    title: 'Mi articulo',
    content: 'Mi contenido',
  };
};

describe('POST /article', () => {
  it('should respond with 201 Created if request is correct', async () => {
    const user = await request(app).post('/v1/user/register').send(userCompleteBody);
    const articleData = getArticleData(user.body.data.id);
    const article = await request(app).post('/v1/article').send(articleData);

    expect(article.status).toBe(201);
    expect(article.body.statusCode).toBe(201);
    expect(article.body.message).toEqual('Created');
    expect(article.body).toHaveProperty('data');
    expect(article.body.data.title).toEqual(articleData.title);
    expect(article.body.data.content).toEqual(articleData.content);
  });

  it("should respond with 404 Not Found if user doesn't exist", async () => {
    const articleData = getArticleData();
    const article = await request(app).post('/v1/article').send(articleData);

    expect(article.status).toBe(404);
    expect(article.body.statusCode).toBe(404);
    expect(article.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(article.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  });
});

afterEach(async () => {
  app.close();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});

afterAll(async () => {
  app.close();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});
