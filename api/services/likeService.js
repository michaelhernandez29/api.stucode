const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const likeService = {};

/**
 * Creates a new like.
 * @param {Object} data - The data for creating the like.
 * @returns {Promise<Object>} A promise that resolves to the created like data.
 */
const create = async (data) => {
  console.log(data);
  return await prisma.like.create({
    data,
  });
};

likeService.create = create;

module.exports = likeService;
