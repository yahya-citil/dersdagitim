const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Bolum = require('./Bolum');

const Hoca = sequelize.define('Hoca', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  soyad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unvan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mazeret_gunleri: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  durum: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'hocalar',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Hoca.belongsTo(Bolum, { foreignKey: 'bolum_id' });
Bolum.hasMany(Hoca, { foreignKey: 'bolum_id' });

module.exports = Hoca; 