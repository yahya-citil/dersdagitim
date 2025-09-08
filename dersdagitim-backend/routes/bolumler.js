const express = require('express');
const router = express.Router();
const Bolum = require('../models/Bolum');

// Tüm bölümleri getir
router.get('/', async (req, res) => {
  try {
    const bolumler = await Bolum.findAll();
    res.json(bolumler);
  } catch (error) {
    console.error('Bölümler getirilirken hata:', error);
    res.status(500).json({ error: 'Bölümler getirilirken bir hata oluştu' });
  }
});

// Yeni bölüm ekle
router.post('/', async (req, res) => {
  try {
    const { ad, fakulte } = req.body;
    if (!ad || !fakulte) {
      return res.status(400).json({ error: 'Ad ve fakülte alanları zorunludur' });
    }
    const bolum = await Bolum.create({ ad, fakulte });
    res.status(201).json(bolum);
  } catch (error) {
    console.error('Bölüm eklenirken hata:', error);
    res.status(500).json({ error: 'Bölüm eklenirken bir hata oluştu' });
  }
});

// Bölüm güncelle
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ad, fakulte } = req.body;
    
    const bolum = await Bolum.findByPk(id);
    if (!bolum) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    await bolum.update({ ad, fakulte });
    res.json(bolum);
  } catch (error) {
    console.error('Bölüm güncellenirken hata:', error);
    res.status(500).json({ error: 'Bölüm güncellenirken bir hata oluştu' });
  }
});

// Bölüm sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bolum = await Bolum.findByPk(id);
    
    if (!bolum) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    await bolum.destroy();
    res.json({ message: 'Bölüm başarıyla silindi' });
  } catch (error) {
    console.error('Bölüm silinirken hata:', error);
    res.status(500).json({ error: 'Bölüm silinirken bir hata oluştu' });
  }
});

module.exports = router; 