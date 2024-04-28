const { Sequelize } = require('sequelize');

const config = require('../config/index.js');

const database = config.get('sequelize.database');
const username = config.get('sequelize.username');
const password = config.get('sequelize.password');

const db = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = db;
