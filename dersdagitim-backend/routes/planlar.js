const express = require('express');
const router = express.Router();
const { Plan, PlanDers } = require('../models/Plan');
const Bolum = require('../models/Bolum');
const Ders = require('../models/Ders');
const Hoca = require('../models/Hoca');
const Derslik = require('../models/Derslik');

// Tüm planları getir
router.get('/', async (req, res) => {
  try {
    const planlar = await Plan.findAll({
      include: [
        { model: Bolum, attributes: ['id', 'ad', 'fakulte'] },
        {
          model: PlanDers,
          as: 'dersler',
          include: [
            { model: Ders, as: 'ders', attributes: ['id', 'ad', 'kod'] },
            { model: Hoca, as: 'hoca', attributes: ['id', 'ad', 'soyad', 'unvan'] },
            { model: Derslik, as: 'derslik', attributes: ['id', 'ad', 'tip', 'kapasite'] }
          ]
        }
      ]
    });
    res.json(planlar);
  } catch (error) {
    console.error('Planlar getirilirken hata:', error);
    res.status(500).json({ error: 'Planlar getirilirken bir hata oluştu' });
  }
});

// Yeni plan ekle
router.post('/', async (req, res) => {
  try {
    const { donem, bolum_id, dersler, durum } = req.body;

    // Gerekli alanları kontrol et
    if (!donem || !bolum_id) {
      return res.status(400).json({ error: 'Dönem ve bölüm bilgisi gereklidir' });
    }

    // Bölümün varlığını kontrol et
    const bolum = await Bolum.findByPk(bolum_id);
    if (!bolum) {
      return res.status(404).json({ error: 'Belirtilen bölüm bulunamadı' });
    }

    // Planı oluştur
    const yeniPlan = await Plan.create({
      donem,
      bolum_id,
      durum: durum || 'taslak'
    });

    // Dersleri ekle
    if (dersler && Array.isArray(dersler)) {
      for (const ders of dersler) {
        // Gerekli alanları kontrol et
        if (!ders.ders_id || !ders.hoca_id || !ders.derslik_id || !ders.gun || !ders.saat) {
          continue; // Eksik bilgili dersi atla
        }

        // Ders, hoca ve dersliğin varlığını kontrol et
        const [dersVar, hocaVar, derslikVar] = await Promise.all([
          Ders.findByPk(ders.ders_id),
          Hoca.findByPk(ders.hoca_id),
          Derslik.findByPk(ders.derslik_id)
        ]);

        if (!dersVar || !hocaVar || !derslikVar) {
          continue; // Geçersiz referansları atla
        }

        await PlanDers.create({
          plan_id: yeniPlan.id,
          ders_id: ders.ders_id,
          hoca_id: ders.hoca_id,
          derslik_id: ders.derslik_id,
          gun: ders.gun,
          saat: ders.saat
        });
      }
    }

    // Planı detaylarıyla birlikte getir
    const planWithDetails = await Plan.findByPk(yeniPlan.id, {
      include: [
        { model: Bolum, attributes: ['id', 'ad', 'fakulte'] },
        {
          model: PlanDers,
          as: 'dersler',
          include: [
            { model: Ders, as: 'ders', attributes: ['id', 'ad', 'kod'] },
            { model: Hoca, as: 'hoca', attributes: ['id', 'ad', 'soyad', 'unvan'] },
            { model: Derslik, as: 'derslik', attributes: ['id', 'ad', 'tip', 'kapasite'] }
          ]
        }
      ]
    });

    res.status(201).json(planWithDetails);
  } catch (error) {
    console.error('Plan eklenirken hata:', error);
    res.status(500).json({ error: 'Plan eklenirken bir hata oluştu' });
  }
});

// Plan güncelle
router.patch('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan bulunamadı' });
    }

    const { donem, bolum_id, durum, dersler } = req.body;

    // Bölüm değişiyorsa varlığını kontrol et
    if (bolum_id && bolum_id !== plan.bolum_id) {
      const bolum = await Bolum.findByPk(bolum_id);
      if (!bolum) {
        return res.status(404).json({ error: 'Belirtilen bölüm bulunamadı' });
      }
    }

    // Planı güncelle
    await plan.update({
      donem: donem || plan.donem,
      bolum_id: bolum_id || plan.bolum_id,
      durum: durum || plan.durum
    });

    // Dersler güncelleniyorsa
    if (dersler && Array.isArray(dersler)) {
      // Eski dersleri sil
      await PlanDers.destroy({ where: { plan_id: plan.id } });

      // Yeni dersleri ekle
      for (const ders of dersler) {
        // Gerekli alanları kontrol et
        if (!ders.ders_id || !ders.hoca_id || !ders.derslik_id || !ders.gun || !ders.saat) {
          continue; // Eksik bilgili dersi atla
        }

        // Ders, hoca ve dersliğin varlığını kontrol et
        const [dersVar, hocaVar, derslikVar] = await Promise.all([
          Ders.findByPk(ders.ders_id),
          Hoca.findByPk(ders.hoca_id),
          Derslik.findByPk(ders.derslik_id)
        ]);

        if (!dersVar || !hocaVar || !derslikVar) {
          continue; // Geçersiz referansları atla
        }

        await PlanDers.create({
          plan_id: plan.id,
          ders_id: ders.ders_id,
          hoca_id: ders.hoca_id,
          derslik_id: ders.derslik_id,
          gun: ders.gun,
          saat: ders.saat
        });
      }
    }

    // Güncellenmiş planı detaylarıyla birlikte getir
    const planWithDetails = await Plan.findByPk(plan.id, {
      include: [
        { model: Bolum, attributes: ['id', 'ad', 'fakulte'] },
        {
          model: PlanDers,
          as: 'dersler',
          include: [
            { model: Ders, as: 'ders', attributes: ['id', 'ad', 'kod'] },
            { model: Hoca, as: 'hoca', attributes: ['id', 'ad', 'soyad', 'unvan'] },
            { model: Derslik, as: 'derslik', attributes: ['id', 'ad', 'tip', 'kapasite'] }
          ]
        }
      ]
    });

    res.json(planWithDetails);
  } catch (error) {
    console.error('Plan güncellenirken hata:', error);
    res.status(500).json({ error: 'Plan güncellenirken bir hata oluştu' });
  }
});

// Plan sil
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan bulunamadı' });
    }

    // Önce plan derslerini sil
    await PlanDers.destroy({ where: { plan_id: plan.id } });
    
    // Sonra planı sil
    await plan.destroy();

    res.json({ message: 'Plan başarıyla silindi' });
  } catch (error) {
    console.error('Plan silinirken hata:', error);
    res.status(500).json({ error: 'Plan silinirken bir hata oluştu' });
  }
});

module.exports = router; 