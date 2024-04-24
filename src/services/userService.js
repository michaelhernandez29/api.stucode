const { Op } = require('sequelize');
const _ = require('lodash');

const user = require('../models/user.js');

const userService = {};

/**
 * Creates a new user.
 * @param {Object} data - The data for creating the user.
 * @returns {Promise<Object>} A promise that resolves to the created user data.
 */
const createUser = async (data) => {
  const newUser = await user.create(data);
  return newUser.get({ plain: true });
};

/**
 * Finds users with pagination and optional filtering.
 * @param {Object} filters - Filters for querying users.
 * @param {Number} filters.page - The page number for pagination.
 * @param {Number} filters.limit - The limit of results per page.
 * @param {String} filters.find - A search term to filter results.
 * @param {String} filters.orderBy - The order of the results. Possible values: 'a-z', 'z-a'.
 * @returns {Promise<Object>} A promise that resolves to an object containing count and users array.
 */
const findAllWithCount = async (filters) => {
  const offset = filters.page * filters.limit;
  let orderQuery = filters.orderBy === 'a-z' ? [['name', 'asc']] : [['name', 'desc']];
  let where = {};

  if (!_.isNil(filters.find)) {
    const str = `%${filters.find}%`;
    const fields = {
      name: { [Op.iLike]: str },
      email: { [Op.iLike]: str },
    };
    where[Op.or] = fields;
  }

  const response = await user.findAndCountAll({
    where,
    limit: filters.limit,
    offset,
    order: orderQuery,
    raw: true,
  });

  return {
    count: response.count ?? 0,
    users: response.rows ?? [],
  };
};

/**
 * Finds a user by id.
 * @param {String} id - The id of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findById = async (id) => {
  return user.findOne({ where: { id }, raw: true });
};

/**
 * Finds a user by email.
 * @param {String} email - The email of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findByEmail = async (email) => {
  return user.findOne({ where: { email }, raw: true });
};

/**
 * Updates a user by ID.
 * @param {String} id - The ID of the user to update.
 * @param {Object} data - The data to update for the user.
 * @returns {Promise<Object|null>} A promise that resolves to the updated user object or null if not found.
 */
const updateById = async (id, data) => {
  const updateUser = await user.update(data, {
    where: { id },
    returning: true,
    raw: true,
  });
  return updateUser[1][0];
};

userService.createUser = createUser;
userService.findAllWithCount = findAllWithCount;
userService.findById = findById;
userService.findByEmail = findByEmail;
userService.updateById = updateById;

module.exports = userService;
