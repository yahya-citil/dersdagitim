const express = require('express');
const router = express.Router();
const Derslik = require('../models/Derslik');

// Tüm derslikleri getir
router.get('/', async (req, res) => {
  try {
    const derslikler = await Derslik.findAll();
    res.json(derslikler);
  } catch (error) {
    console.error('Derslikler getirilirken hata:', error);
    res.status(500).json({ error: 'Derslikler getirilirken bir hata oluştu' });
  }
});

// Yeni derslik ekle
router.post('/', async (req, res) => {
  try {
    const { ad, tip, kapasite, kat, blok } = req.body;
    if (!ad || !tip || !kapasite || !kat || !blok) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }
    const derslik = await Derslik.create({ ad, tip, kapasite, kat, blok });
    res.status(201).json(derslik);
  } catch (error) {
    console.error('Derslik eklenirken hata:', error);
    res.status(500).json({ error: 'Derslik eklenirken bir hata oluştu' });
  }
});

// Derslik güncelle
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ad, tip, kapasite, kat, blok } = req.body;
    
    const derslik = await Derslik.findByPk(id);
    if (!derslik) {
      return res.status(404).json({ error: 'Derslik bulunamadı' });
    }

    await derslik.update({ ad, tip, kapasite, kat, blok });
    res.json(derslik);
  } catch (error) {
    console.error('Derslik güncellenirken hata:', error);
    res.status(500).json({ error: 'Derslik güncellenirken bir hata oluştu' });
  }
});

// Derslik sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const derslik = await Derslik.findByPk(id);
    
    if (!derslik) {
      return res.status(404).json({ error: 'Derslik bulunamadı' });
    }

    await derslik.destroy();
    res.json({ message: 'Derslik başarıyla silindi' });
  } catch (error) {
    console.error('Derslik silinirken hata:', error);
    res.status(500).json({ error: 'Derslik silinirken bir hata oluştu' });
  }
});

module.exports = router; 