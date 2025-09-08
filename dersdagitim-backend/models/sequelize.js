const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PGDATABASE || 'dersdagitim',
  process.env.PGUSER || 'postgres',
  process.env.PGPASSWORD || 'sa',
  {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize; 