const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Bolum = require('./Bolum');

const Ders = sequelize.define('Ders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kredi: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sinif: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bolum_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Bolum,
      key: 'id'
    }
  }
}, {
  tableName: 'dersler',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Ders.belongsTo(Bolum, { foreignKey: 'bolum_id' });
Bolum.hasMany(Ders, { foreignKey: 'bolum_id' });

module.exports = Ders; 