const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Derslik = sequelize.define('Derslik', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kapasite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kat: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  blok: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'derslikler',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Derslik; 