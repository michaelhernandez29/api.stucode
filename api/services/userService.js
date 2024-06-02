const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const userService = {};

/**
 * Creates a new user.
 * @param {Object} data - The data for creating the user.
 * @returns {Promise<Object>} A promise that resolves to the created user data.
 */
const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
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
  const { page, limit, find, orderBy } = filters;
  const skip = page * limit;

  const where = {};
  if (find) {
    where.OR = [{ name: { contains: find, mode: 'insensitive' } }, { email: { contains: find, mode: 'insensitive' } }];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: orderBy === 'a-z' ? { name: 'asc' } : { name: 'desc' },
    skip,
    take: limit,
  });

  const count = await prisma.user.count({ where });

  return { count, users };
};

/**
 * Finds a user by id.
 * @param {String} id - The id of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Finds a user by email.
 * @param {String} email - The email of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Updates a user by ID.
 * @param {String} id - The ID of the user to update.
 * @param {Object} data - The data to update for the user.
 * @returns {Promise<Object|null>} A promise that resolves to the updated user object or null if not found.
 */
const updateById = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * Deletes a user by ID.
 * @param {String} id - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
 */
const deleteById = async (id) => {
  const users = await userService.findAllWithCount({ page: 0, limit: 20, orderBy: 'a-z' });
  users.forEach(async (user) => {
    const idToRemove = Number.parseInt(id, 10);
    if (user.followers.includes(idToRemove)) {
      user.followers = user.followers.filter((followerId) => followerId !== idToRemove);
    }

    await userService.updateById(user.id, { followers: user.followers });
  });

  return await prisma.user.delete({
    where: { id },
  });
};

userService.createUser = createUser;
userService.findAllWithCount = findAllWithCount;
userService.findById = findById;
userService.findByEmail = findByEmail;
userService.updateById = updateById;
userService.deleteById = deleteById;

module.exports = userService;
