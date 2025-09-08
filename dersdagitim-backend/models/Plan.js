const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Bolum = require('./Bolum');
const Ders = require('./Ders');
const Hoca = require('./Hoca');
const Derslik = require('./Derslik');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donem: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durum: {
    type: DataTypes.STRING,
    defaultValue: 'taslak',
    validate: {
      isIn: [['taslak', 'onay_bekliyor', 'onaylandi', 'reddedildi']]
    }
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
  tableName: 'planlar',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Plan.belongsTo(Bolum, { foreignKey: 'bolum_id' });
Bolum.hasMany(Plan, { foreignKey: 'bolum_id' });

// PlanDers: Plan içindeki dersler, hoca, derslik, gün, saat
const PlanDers = sequelize.define('PlanDers', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  plan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Plan,
      key: 'id'
    },
    allowNull: false
  },
  ders_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Ders,
      key: 'id'
    },
    allowNull: false
  },
  hoca_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Hoca,
      key: 'id'
    },
    allowNull: false
  },
  derslik_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Derslik,
      key: 'id'
    },
    allowNull: false
  },
  gun: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']]
    }
  },
  saat: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['08:30-09:20', '09:30-10:20', '10:30-11:20', '11:30-12:20', '13:30-14:20', '14:30-15:20', '15:30-16:20', '16:30-17:20']]
    }
  }
}, {
  tableName: 'plan_dersler',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Plan.hasMany(PlanDers, { foreignKey: 'plan_id', as: 'dersler' });
PlanDers.belongsTo(Plan, { foreignKey: 'plan_id' });
PlanDers.belongsTo(Ders, { foreignKey: 'ders_id', as: 'ders' });
PlanDers.belongsTo(Hoca, { foreignKey: 'hoca_id', as: 'hoca' });
PlanDers.belongsTo(Derslik, { foreignKey: 'derslik_id', as: 'derslik' });

module.exports = { Plan, PlanDers }; 