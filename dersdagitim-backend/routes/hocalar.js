const express = require('express');
const router = express.Router();
const Hoca = require('../models/Hoca');
const Bolum = require('../models/Bolum');

// Tüm hocaları getir
router.get('/', async (req, res) => {
  try {
    const hocalar = await Hoca.findAll({
      include: [{
        model: Bolum,
        attributes: ['id', 'ad', 'fakulte']
      }]
    });
    res.json(hocalar);
  } catch (error) {
    console.error('Hocalar getirilirken hata:', error);
    res.status(500).json({ error: 'Hocalar getirilirken bir hata oluştu' });
  }
});

// Yeni hoca ekle
router.post('/', async (req, res) => {
  try {
    const { ad, soyad, unvan, bolum_id, email, telefon, mazeret_gunleri, durum } = req.body;
    
    if (!ad || !soyad || !unvan || !bolum_id) {
      return res.status(400).json({ error: 'Ad, soyad, unvan ve bölüm alanları zorunludur' });
    }

    const bolum = await Bolum.findByPk(bolum_id);
    if (!bolum) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const hoca = await Hoca.create({
      ad,
      soyad,
      unvan,
      bolum_id,
      email,
      telefon,
      mazeret_gunleri,
      durum
    });
    res.status(201).json(hoca);
  } catch (error) {
    console.error('Hoca eklenirken hata:', error);
    res.status(500).json({ error: 'Hoca eklenirken bir hata oluştu' });
  }
});

// Hoca güncelle
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ad, soyad, unvan, bolum_id, email, telefon, mazeret_gunleri, durum } = req.body;
    
    const hoca = await Hoca.findByPk(id);
    if (!hoca) {
      return res.status(404).json({ error: 'Hoca bulunamadı' });
    }

    if (bolum_id) {
      const bolum = await Bolum.findByPk(bolum_id);
      if (!bolum) {
        return res.status(404).json({ error: 'Bölüm bulunamadı' });
      }
    }

    await hoca.update({
      ad,
      soyad,
      unvan,
      bolum_id,
      email,
      telefon,
      mazeret_gunleri,
      durum
    });
    res.json(hoca);
  } catch (error) {
    console.error('Hoca güncellenirken hata:', error);
    res.status(500).json({ error: 'Hoca güncellenirken bir hata oluştu' });
  }
});

// Hoca sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hoca = await Hoca.findByPk(id);
    
    if (!hoca) {
      return res.status(404).json({ error: 'Hoca bulunamadı' });
    }

    await hoca.destroy();
    res.json({ message: 'Hoca başarıyla silindi' });
  } catch (error) {
    console.error('Hoca silinirken hata:', error);
    res.status(500).json({ error: 'Hoca silinirken bir hata oluştu' });
  }
});

module.exports = router; 