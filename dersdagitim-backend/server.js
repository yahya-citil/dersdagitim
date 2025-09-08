const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bolumler', require('./routes/bolumler'));
app.use('/api/dersler', require('./routes/dersler'));
app.use('/api/hocalar', require('./routes/hocalar'));
app.use('/api/derslikler', require('./routes/derslikler'));
app.use('/api/planlar', require('./routes/planlar'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bir hata oluştu!' });
});

const PORT = process.env.PORT || 5000;

// Sequelize debug loglarını kapat
sequelize.options.logging = false;

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL veritabanına başarıyla bağlanıldı.');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('Veritabanına bağlanılamadı:', err);
  }); 