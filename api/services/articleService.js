const _ = require('lodash');
const { Op } = require('sequelize');

const article = require('../models/article.js');

const articleService = {};

/**
 * Creates a new article along with an associated user.
 * @param {Object} data - The data for creating the article.
 * @returns {Promise<Object>} A promise that resolves to the created article data.
 */
const create = async (data) => {
  const newArticle = await article.create(data);
  return newArticle.get({ plain: true });
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
  const offset = filters.page * filters.limit;
  let orderQuery = filters.orderBy === 'a-z' ? [['title', 'asc']] : [['title', 'desc']];
  let where = {};

  if (!_.isNil(filters.userId)) {
    where.userId = filters.userId;
  }

  if (!_.isNil(filters.find)) {
    const str = `%${filters.find}%`;
    const fields = {
      title: { [Op.iLike]: str },
      content: { [Op.iLike]: str },
    };
    where[Op.or] = fields;
  }

  const response = await article.findAndCountAll({
    where,
    limit: filters.limit,
    offset,
    order: orderQuery,
    raw: true,
  });

  return {
    count: response.count ?? 0,
    articles: response.rows ?? [],
  };
};

articleService.create = create;
articleService.findAllWithCount = findAllWithCount;

module.exports = articleService;