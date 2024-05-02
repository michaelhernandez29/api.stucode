const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const articleService = {};

/**
 * Creates a new article along with an associated user.
 * @param {Object} data - The data for creating the article.
 * @returns {Promise<Object>} A promise that resolves to the created article data.
 */
const create = async (data) => {
  return await prisma.article.create({
    data,
  });
};

/**
 * Finds articles with pagination and optional filtering.
 * @param {Object} filters - Filters for querying articles.
 * @param {String} filters.userId - The user's Id.
 * @param {Number} filters.page - The page number for pagination.
 * @param {Number} filters.limit - The limit of results per page.
 * @param {String} filters.find - A search term to filter results.
 * @param {String} filters.orderBy - The order of the results. Possible values: 'a-z', 'z-a'.
 * @returns {Promise<Object>} A promise that resolves to an object containing count and articles array.
 */
const findAllWithCount = async (filters) => {
  const { userId, page, limit, find, orderBy } = filters;
  const skip = page * limit;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (find) {
    where.OR = [{ title: { contains: find } }, { content: { contains: find } }];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: orderBy === 'a-z' ? { title: 'asc' } : { title: 'desc' },
    skip,
    take: limit,
  });

  const count = await prisma.article.count({ where });

  return { count, articles };
};

/**
 * Finds a article by id.
 * @param {String} id - The id of the article to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found article object or null if not found.
 */
const findById = async (id) => {
  return await prisma.article.findUnique({
    where: { id },
  });
};

/**
 * Updates an article by ID.
 * @param {String} id - The ID of the article to update.
 * @param {String} userId - The ID of the user.
 * @param {Object} data - The data to update for the article.
 * @returns {Promise<Object|null>} A promise that resolves to the updated article object or null if not found.
 */
const updateById = async (id, userId, data) => {
  return await prisma.article.update({
    where: { id, userId },
    data,
  });
};

/**
 * Deletes a article by ID.
 * @param {String} id - The ID of the article to delete.
 * @returns {Promise<void>} A promise that resolves when the article is successfully deleted.
 */
const deleteById = async (id) => {
  return await prisma.article.delete({
    where: { id },
  });
};

articleService.create = create;
articleService.findAllWithCount = findAllWithCount;
articleService.findById = findById;
articleService.updateById = updateById;
articleService.deleteById = deleteById;

module.exports = articleService;
