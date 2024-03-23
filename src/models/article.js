const { DataTypes } = require('sequelize');

const db = require('../lib/db.js');
const user = require('./user.js');

const article = db.define(
  'article',
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: user,
        key: 'id',
      },
      onDelete: 'cascade',
      field: 'user_id',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'title',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
    },
  },
  {
    timestamps: true,
    underscored: false,
    tableName: 'articles',
  }
);

article.belongsTo(user, { foreignKey: 'userId' });

module.exports = article;
