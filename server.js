const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTOS_PATH = path.join(__dirname, 'data', 'productos.json');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(PRODUCTOS_PATH)) fs.writeFileSync(PRODUCTOS_PATH, '{}');

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.static(__dirname));
app.get('/zxing.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules/@zxing/library/umd/index.min.js'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'escaner.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/productos', (req, res) => {
  const data = fs.readFileSync(PRODUCTOS_PATH, 'utf-8');
  res.json(JSON.parse(data));
});

app.post('/api/admin/upload', upload.single('excel'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se recibió ningún archivo.' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const productos = {};
    for (const row of rows) {
      if (row['Estado'] !== 'Activo') continue;
      const sku = row['SKU'];
      if (!sku) continue;

      productos[sku] = {
        nombre: row['Nombre'],
        precio: row['Precio Final']
      };
    }

    fs.writeFileSync(PRODUCTOS_PATH, JSON.stringify(productos, null, 2));

    res.json({ ok: true, total: Object.keys(productos).length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`CEME Scanner corriendo en http://localhost:${PORT}`);
});
