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
  await prisma.user.deleteMany();
  await prisma.like.deleteMany();
});

beforeEach(async () => {
  app = server.listen(config.get('port'));
  await prisma.$connect();
});

const getArticleData = (userId = null) => {
  return {
    userId: userId ?? '111111111',
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
  }, 20000);

  it("should respond with 404 Not Found if user doesn't exist", async () => {
    const articleData = getArticleData();
    const article = await request(app).post('/v1/article').send(articleData);

    expect(article.status).toBe(404);
    expect(article.body.statusCode).toBe(404);
    expect(article.body.message).toEqual(errorMessages.USER_NOT_FOUND);
    expect(article.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  }, 20000);
});

describe('GET /article', () => {
  it('should respond with 200 OK with count N if there are N users in the system', async () => {
    const user = await request(app).post('/v1/user/register').send(userCompleteBody);
    const articleData = getArticleData(user.body.data.id);
    await request(app).post('/v1/article').send(articleData);
    await request(app).post('/v1/article').send(articleData);

    const response = await request(app).get('/v1/article');

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('count');
    expect(response.body.data.length).toEqual(2);
    expect(response.body.count).toEqual(2);
  }, 20000);

  it('should respond with 200 OK with count 0 if there are not articles in the system', async () => {
    const response = await request(app).get('/v1/article');

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('count');
    expect(response.body.data.length).toEqual(0);
    expect(response.body.count).toEqual(0);
  }, 20000);
});

describe('GET /article/{id}', () => {
  it('should respond with 200 OK if the article exists', async () => {
    const user = await request(app).post('/v1/user/register').send(userCompleteBody);
    const articleData = getArticleData(user.body.data.id);
    const article = await request(app).post('/v1/article').send(articleData);

    const response = await request(app).get(`/v1/article/${article.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.title).toEqual(articleData.title);
    expect(response.body.data.content).toEqual(articleData.content);
  }, 20000);

  it("should respond with 404 Not Found if the article doesn't exist", async () => {
    const id = '111111111';

    const response = await request(app).get(`/v1/article/${id}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.ARTICLE_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  }, 20000);
});

describe('PUT /article/{id}', () => {
  it('should respond with 200 OK if the udpate was successful', async () => {
    const user = await request(app).post('/v1/user/register').send(userCompleteBody);
    const articleData = getArticleData(user.body.data.id);
    const article = await request(app).post('/v1/article').send(articleData);

    const response = await request(app).put(`/v1/article/${article.body.data.id}`).send(articleData);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.title).toEqual(articleData.title);
    expect(response.body.data.content).toEqual(articleData.content);
  }, 20000);

  it("should respond with 404 Not Found if the article doesn't exist", async () => {
    const id = '111111111';

    const articleData = getArticleData(id);
    const response = await request(app).put(`/v1/article/${id}`).send(articleData);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.ARTICLE_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  }, 20000);
});

describe('DELETE /article/{id}', () => {
  it('should respond with 200 OK if the article was deleted', async () => {
    const user = await request(app).post('/v1/user/register').send(userCompleteBody);
    const articleData = getArticleData(user.body.data.id);
    const article = await request(app).post('/v1/article').send(articleData);

    const response = await request(app).delete(`/v1/article/${article.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.message).toEqual('OK');
  }, 20000);

  it("should respond with 404 Not Found if the article doesn't exist", async () => {
    const id = '111111111';

    const articleData = getArticleData(id);
    const response = await request(app).delete(`/v1/article/${id}`).send(articleData);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toEqual(errorMessages.ARTICLE_NOT_FOUND);
    expect(response.body.errorCode).toEqual(errorCodes.NOT_FOUND);
  }, 20000);
});

afterEach(async () => {
  app.close();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  await prisma.like.deleteMany();
  await prisma.$disconnect();
});

afterAll(async () => {
  app.close();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  await prisma.like.deleteMany();

  await prisma.$disconnect();
});
