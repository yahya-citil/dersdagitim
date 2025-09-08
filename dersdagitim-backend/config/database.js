const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dersdagitim', 'postgres', 'sa', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log,
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: false
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL veritabanına başarıyla bağlanıldı.');
  } catch (error) {
    console.error('Veritabanına bağlanırken hata oluştu:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; 