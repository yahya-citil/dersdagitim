const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'dersdagitim',
  password: 'sa',
  port: 5432,
});

async function initializeDatabase() {
  try {
    await client.connect();
    console.log('PostgreSQL\'e bağlanıldı');

    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    console.log('Veritabanı tabloları başarıyla oluşturuldu');

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await client.end();
  }
}

initializeDatabase(); 