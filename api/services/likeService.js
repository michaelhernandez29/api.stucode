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
 * @returns {Promise<Object>} A promise that resolves to an object containing count and likes data.
 */
const findAllByArticleIdWithCount = async (articleId) => {
  const likes = await prisma.like.findMany({
    where: {
      article: {
        id: articleId,
      },
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
const findAllByUserIdWithCount = async (userId) => {
  const likes = await prisma.like.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });

  const count = likes.length;

  return { count, likes };
};

likeService.create = create;
likeService.findAllByArticleIdWithCount = findAllByArticleIdWithCount;
likeService.deleteByArticleIdAndUserId = deleteByArticleIdAndUserId;
likeService.findAllByUserIdWithCount = findAllByUserIdWithCount;

module.exports = likeService;
