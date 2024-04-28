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
 * Finds all articles.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of articles.
 */
const findAll = async () => {
  return article.findAll();
};

articleService.create = create;
articleService.findAll = findAll;

module.exports = articleService;
