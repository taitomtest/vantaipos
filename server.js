const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static POS files (HTML, CSS, JS, manifest, Service Worker)
app.use(express.static(__dirname));

// Read from JSON file database
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Return empty default state
    return {};
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content) || {};
  } catch (error) {
    console.error('Error reading database file:', error);
    return {};
  }
}

// Write to JSON file database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database file:', error);
    return false;
  }
}

// Endpoints
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Full Sync GET
app.get('/api/sync', (req, res) => {
  try {
    const db = readDB();
    res.json({ success: true, data: db });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Full Sync POST
app.post('/api/sync', (req, res) => {
  try {
    const clientData = req.body;
    const db = readDB();
    
    // Merge or overwrite data tables
    const keys = [
      'products', 'orders', 'categories', 'customers', 
      'suppliers', 'delivery', 'cashbook', 'users', 
      'current_user', 'shift', 'shift_history', 'vouchers',
      'tables', 'purchases', 'activity_logs', 'settings'
    ];
    
    keys.forEach(key => {
      if (clientData[key] !== undefined) {
        db[key] = clientData[key];
      }
    });

    const success = writeDB(db);
    if (success) {
      res.json({ success: true, message: 'Đồng bộ dữ liệu thành công!' });
    } else {
      res.status(500).json({ success: false, message: 'Không thể ghi vào file cơ sở dữ liệu.' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Individual Entity REST Endpoints (for extensibility)
app.get('/api/:entity', (req, res) => {
  const { entity } = req.params;
  const db = readDB();
  res.json(db[entity] || []);
});

app.post('/api/:entity', (req, res) => {
  const { entity } = req.params;
  const data = req.body;
  const db = readDB();
  db[entity] = data;
  const success = writeDB(db);
  res.json({ success, message: `Đã lưu thực thể: ${entity}` });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MÁY CHỦ VĂN TÀI POS ĐANG CHẠY!`);
  console.log(`💻 Địa chỉ ứng dụng: http://localhost:${PORT}`);
  console.log(`📡 REST API endpoint: http://localhost:${PORT}/api/status`);
  console.log(`📁 File lưu trữ cơ sở dữ liệu: ${DB_FILE}`);
  console.log(`====================================================`);
});
