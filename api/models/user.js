const { DataTypes } = require('sequelize');

const db = require('../lib/db.js');

const user = db.define(
  'user',
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'email',
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'job_title',
    },
    biography: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'biography',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password',
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logo',
    },
  },
  {
    timestamps: true,
    underscored: false,
    tableName: 'users',
  },
);

module.exports = user;
