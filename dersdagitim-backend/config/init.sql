-- Önce tüm tabloları temizleyelim
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Bölümler tablosu
CREATE TABLE bolumler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    fakulte VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Derslikler tablosu
CREATE TABLE derslikler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    tip VARCHAR(50) NOT NULL,
    kapasite INTEGER NOT NULL,
    kat INTEGER NOT NULL,
    blok VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dersler tablosu
CREATE TABLE dersler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    kod VARCHAR(50) NOT NULL,
    kredi INTEGER NOT NULL,
    sinif INTEGER NOT NULL,
    bolum_id INTEGER NOT NULL REFERENCES bolumler(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hocalar tablosu
CREATE TABLE hocalar (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL,
    soyad VARCHAR(255) NOT NULL,
    unvan VARCHAR(50) NOT NULL,
    bolum_id INTEGER NOT NULL REFERENCES bolumler(id),
    email VARCHAR(255),
    telefon VARCHAR(20),
    mazeret_gunleri JSONB DEFAULT '[]',
    durum BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planlar tablosu
CREATE TABLE planlar (
    id SERIAL PRIMARY KEY,
    donem VARCHAR(50) NOT NULL,
    bolum_id INTEGER NOT NULL REFERENCES bolumler(id),
    durum VARCHAR(50) DEFAULT 'taslak',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan Dersleri tablosu
CREATE TABLE plan_dersler (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL REFERENCES planlar(id),
    ders_id INTEGER NOT NULL REFERENCES dersler(id),
    hoca_id INTEGER NOT NULL REFERENCES hocalar(id),
    derslik_id INTEGER NOT NULL REFERENCES derslikler(id),
    gun VARCHAR(20) NOT NULL,
    saat VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 