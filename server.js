const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const FILE_PATH = path.join(__dirname, 'database.json');

// Şifreli veriyi kaydetme endpoint'i
app.post('/api/save', (req, res) => {
    fs.writeFile(FILE_PATH, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).send('Hata');
        res.send('Başarıyla kaydedildi.');
    });
});

app.delete('/api/database', (req, res) => {
    fs.unlink(FILE_PATH, (err) => {
        if (err && err.code !== 'ENOENT') return res.status(500).send('Hata');
        res.send('Veritabanı silindi.');
    });
});

app.listen(3000, () => console.log('Sunucu çalışıyor: http://localhost:3000'));
