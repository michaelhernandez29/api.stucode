const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const likeService = {};

/**
 * Creates a new like.
 * @param {Object} data - The data for creating the like.
 * @returns {Promise<Object>} A promise that resolves to the created like data.
 */
const create = async (data) => {
  return await prisma.like.create({ data });
};

/**
 * Finds all likes with count by article ID.
 * @param {number} articleId - The ID of the article to find likes for.
 * @param {number} userId - The ID of the user to find likes for.
 * @returns {Promise<Object>} A promise that resolves to an object containing count and likes data.
 */
const findAllByArticleIdWithCount = async (articleId, userId) => {
  const likes = await prisma.like.findMany({
    where: {
      articleId,
      userId,
    },
  });

  const count = likes.length;

  return { count, likes };
};

const deleteByArticleIdAndUserId = async (articleId, userId) => {
  await prisma.like.deleteMany({
    where: {
      articleId: articleId,
      userId: userId,
    },
  });
};

/**
 * Finds all likes with count by user ID.
 * @param {number} userId - The ID of the user to find likes for.
 * @returns {Promise<Object>} A promise that resolves to an object containing count and likes data.
 */
const findAllByUserIdWithCount = async (filters) => {
  const { userId, page, limit, find, orderBy } = filters;
  const skip = page * limit;
  let orderByClause;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (find) {
    where.OR = [
      { article: { title: { contains: find, mode: 'insensitive' } } },
      { article: { content: { contains: find, mode: 'insensitive' } } },
    ];
  }
  if (orderBy === 'a-z') {
    orderByClause = { article: { title: 'asc' } };
  } else if (orderBy === 'z-a') {
    orderByClause = { article: { title: 'desc' } };
  } else if (orderBy === 'updated-at-asc') {
    orderByClause = { article: { updatedAt: 'asc' } };
  } else if (orderBy === 'updated-at-desc') {
    orderByClause = { article: { updatedAt: 'desc' } };
  } else {
    orderByClause = { article: { title: 'asc' } };
  }

  const likes = await prisma.like.findMany({
    where,
    include: {
      article: true,
    },
    orderBy: orderByClause,
    skip,
    take: limit,
  });

  const count = likes.length;

  return { count, likes };
};

likeService.create = create;
likeService.findAllByArticleIdWithCount = findAllByArticleIdWithCount;
likeService.deleteByArticleIdAndUserId = deleteByArticleIdAndUserId;
likeService.findAllByUserIdWithCount = findAllByUserIdWithCount;

module.exports = likeService;
