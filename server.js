const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `photo_${timestamp}${ext}`);
  }
});

const upload = multer({ storage });

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Main page - Consent page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Secret path with random characters
app.get('/n3m9k7x2q5z', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Camera page
app.get('/camera', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'camera.html'));
});

// Upload photo endpoint
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filename = req.file.filename;
  console.log(`📸 Photo saved: ${filename}`);

  res.json({
    success: true,
    message: 'Photo saved successfully',
    filename: filename,
    path: `/photos/${filename}`
  });
});

// Gallery page (with authentication)
app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

// Get photos API (with code verification)
app.get('/api/photos', (req, res) => {
  const code = req.query.code;

  if (code !== '777') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  fs.readdir(photosDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read photos' });
    }

    const photos = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/photos/${file}`,
        date: fs.statSync(path.join(photosDir, file)).mtime
      }))
      .sort((a, b) => b.date - a.date);

    res.json(photos);
  });
});

// Serve photos
app.use('/photos', express.static(photosDir));

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`\n📍 Routes:`);
  console.log(`   • Home (Consent) → http://localhost:${PORT}`);
  console.log(`   • Camera → http://localhost:${PORT}/camera`);
  console.log(`   • Gallery → http://localhost:${PORT}/gallery`);
  console.log(`\n📸 Photos saved to: ${photosDir}`);
  console.log(`🔐 Gallery Password: 777\n`);
});
