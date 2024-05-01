const { Sequelize } = require('sequelize');
const pg = require('pg');

const config = require('../config/index.js');

const database = config.get('sequelize.database');
const username = config.get('sequelize.username');
const password = config.get('sequelize.password');
const host = config.get('sequelize.host');

const db = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  logging: false,
  dialectModule: pg,
});

module.exports = db;
