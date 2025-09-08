const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Plan = require('./Plan');
const Ders = require('./Ders');
const Hoca = require('./Hoca');
const Derslik = require('./Derslik');

const PlanDers = sequelize.define('PlanDers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plan,
      key: 'id'
    }
  },
  ders_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ders,
      key: 'id'
    }
  },
  hoca_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hoca,
      key: 'id'
    }
  },
  derslik_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Derslik,
      key: 'id'
    }
  },
  gun: {
    type: DataTypes.STRING,
    allowNull: false
  },
  saat: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'plan_dersler',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

PlanDers.belongsTo(Plan, { foreignKey: 'plan_id' });
Plan.hasMany(PlanDers, { foreignKey: 'plan_id' });

PlanDers.belongsTo(Ders, { foreignKey: 'ders_id' });
Ders.hasMany(PlanDers, { foreignKey: 'ders_id' });

PlanDers.belongsTo(Hoca, { foreignKey: 'hoca_id' });
Hoca.hasMany(PlanDers, { foreignKey: 'hoca_id' });

PlanDers.belongsTo(Derslik, { foreignKey: 'derslik_id' });
Derslik.hasMany(PlanDers, { foreignKey: 'derslik_id' });

module.exports = PlanDers; 