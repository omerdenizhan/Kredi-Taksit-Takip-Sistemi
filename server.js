const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.db');
const LEGACY_JSON_PATH = path.join(__dirname, 'database.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Veritabanı ve sunucu dosyaları tarayıcıdan doğrudan indirilemesin
app.use((req, res, next) => {
    const name = path.basename(decodeURIComponent(req.path)).toLowerCase();
    if (/^database\.(db|json)(-wal|-shm|-journal)?$/.test(name) || name === 'server.js') {
        return res.status(404).send('Bulunamadı.');
    }
    next();
});
app.use(express.static(__dirname));

// ---- SQLite veritabanı ---------------------------------------------------
// Veri tarayıcıda AES-256-GCM ile şifrelenir; sunucu yalnızca şifreli
// paketi (salt, iv, data) saklar ve içeriğini hiçbir zaman göremez.
const db = new DatabaseSync(DB_PATH);
db.exec(`
    CREATE TABLE IF NOT EXISTS app_data (
        id         INTEGER PRIMARY KEY CHECK (id = 1),
        salt       BLOB NOT NULL,
        iv         BLOB NOT NULL,
        data       BLOB NOT NULL,
        updated_at TEXT NOT NULL
    )
`);

const selectStmt = db.prepare('SELECT salt, iv, data FROM app_data WHERE id = 1');
const upsertStmt = db.prepare(`
    INSERT INTO app_data (id, salt, iv, data, updated_at) VALUES (1, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET salt = excluded.salt, iv = excluded.iv,
                                  data = excluded.data, updated_at = excluded.updated_at
`);
const deleteStmt = db.prepare('DELETE FROM app_data WHERE id = 1');

function isByteArray(value) {
    return Array.isArray(value) && value.length > 0 &&
        value.every(n => Number.isInteger(n) && n >= 0 && n <= 255);
}

function savePayload(payload) {
    if (!payload || !isByteArray(payload.salt) || !isByteArray(payload.iv) || !isByteArray(payload.data)) {
        return false;
    }
    upsertStmt.run(
        Buffer.from(payload.salt),
        Buffer.from(payload.iv),
        Buffer.from(payload.data),
        new Date().toISOString()
    );
    return true;
}

// Eski database.json varsa ve database.db boşsa şifreli veriyi bir kez aktar
if (!selectStmt.get() && fs.existsSync(LEGACY_JSON_PATH)) {
    try {
        const legacy = JSON.parse(fs.readFileSync(LEGACY_JSON_PATH, 'utf8'));
        if (savePayload(legacy)) {
            console.log("database.json içindeki veriler database.db dosyasına aktarıldı.");
        }
    } catch (err) {
        console.warn('database.json aktarılamadı:', err.message);
    }
}

// ---- API -------------------------------------------------------------------
app.get('/api/database', (req, res) => {
    const row = selectStmt.get();
    if (!row) return res.status(404).send('Veritabanı boş.');
    res.set('Cache-Control', 'no-store');
    res.json({
        salt: Array.from(row.salt),
        iv: Array.from(row.iv),
        data: Array.from(row.data)
    });
});

app.get('/api/database/info', (req, res) => {
    let size = 0;
    try { size = fs.statSync(DB_PATH).size; } catch (err) { size = 0; }
    res.set('Cache-Control', 'no-store');
    res.json({ fileName: path.basename(DB_PATH), size });
});

app.post('/api/save', (req, res) => {
    try {
        if (!savePayload(req.body)) return res.status(400).send('Geçersiz şifreli veri.');
        res.send('Başarıyla kaydedildi.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hata');
    }
});

app.delete('/api/database', (req, res) => {
    try {
        deleteStmt.run();
        res.send('Veritabanı silindi.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hata');
    }
});

app.listen(PORT, () => console.log(`Sunucu çalışıyor: (Veritabanı: database.db) http://localhost:${PORT}`));
