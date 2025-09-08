const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bolum = sequelize.define('Bolum', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fakulte: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'bolumler',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Bolum; 