const express = require('express');
const router = express.Router();
const Ders = require('../models/Ders');
const Bolum = require('../models/Bolum');

// Tüm dersleri getir
router.get('/', async (req, res) => {
  try {
    const dersler = await Ders.findAll({
      include: [{
        model: Bolum,
        attributes: ['id', 'ad', 'fakulte']
      }]
    });
    res.json(dersler);
  } catch (error) {
    console.error('Dersler getirilirken hata:', error);
    res.status(500).json({ error: 'Dersler getirilirken bir hata oluştu' });
  }
});

// Yeni ders ekle
router.post('/', async (req, res) => {
  try {
    const { ad, kod, kredi, sinif, bolum_id } = req.body;
    if (!ad || !kod || !kredi || !sinif || !bolum_id) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    const bolum = await Bolum.findByPk(bolum_id);
    if (!bolum) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const ders = await Ders.create({ ad, kod, kredi, sinif, bolum_id });
    res.status(201).json(ders);
  } catch (error) {
    console.error('Ders eklenirken hata:', error);
    res.status(500).json({ error: 'Ders eklenirken bir hata oluştu' });
  }
});

// Ders güncelle
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ad, kod, kredi, sinif, bolum_id } = req.body;
    
    const ders = await Ders.findByPk(id);
    if (!ders) {
      return res.status(404).json({ error: 'Ders bulunamadı' });
    }

    if (bolum_id) {
      const bolum = await Bolum.findByPk(bolum_id);
      if (!bolum) {
        return res.status(404).json({ error: 'Bölüm bulunamadı' });
      }
    }

    await ders.update({ ad, kod, kredi, sinif, bolum_id });
    res.json(ders);
  } catch (error) {
    console.error('Ders güncellenirken hata:', error);
    res.status(500).json({ error: 'Ders güncellenirken bir hata oluştu' });
  }
});

// Ders sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ders = await Ders.findByPk(id);
    
    if (!ders) {
      return res.status(404).json({ error: 'Ders bulunamadı' });
    }

    await ders.destroy();
    res.json({ message: 'Ders başarıyla silindi' });
  } catch (error) {
    console.error('Ders silinirken hata:', error);
    res.status(500).json({ error: 'Ders silinirken bir hata oluştu' });
  }
});

module.exports = router; 