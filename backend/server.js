
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Simulation
let subjects = [];
let chapters = [];
let files = [];

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Subject Routes
app.get('/api/subjects', (req, res) => res.json(subjects));
app.post('/api/subjects', (req, res) => {
  const newSub = { id: Date.now().toString(), ...req.body, fileCount: 0 };
  subjects.push(newSub);
  res.status(201).json(newSub);
});
app.delete('/api/subjects/:id', (req, res) => {
  subjects = subjects.filter(s => s.id !== req.params.id);
  chapters = chapters.filter(c => c.subjectId !== req.params.id);
  // Also filter files linked to those chapters...
  res.status(204).send();
});

// Chapter Routes
app.get('/api/subjects/:subjectId/chapters', (req, res) => {
  res.json(chapters.filter(c => c.subjectId === req.params.subjectId));
});

app.post('/api/chapters', (req, res) => {
  const newChap = { 
    id: Date.now().toString(), 
    ...req.body, 
    fileCount: 0,
    lastUpdated: 'Just now'
  };
  chapters.push(newChap);
  res.status(201).json(newChap);
});

app.put('/api/chapters/:id', (req, res) => {
  chapters = chapters.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
  res.json(chapters.find(c => c.id === req.params.id));
});

app.delete('/api/chapters/:id', (req, res) => {
  chapters = chapters.filter(c => c.id !== req.params.id);
  files = files.filter(f => f.chapterId !== req.params.id);
  res.status(204).send();
});

// File Routes
app.get('/api/chapters/:chapterId/files', (req, res) => {
  res.json(files.filter(f => f.chapterId === req.params.chapterId));
});

app.post('/api/chapters/:id/files', upload.single('file'), (req, res) => {
  const newFile = {
    id: Date.now().toString(),
    chapterId: req.params.id,
    name: req.file.originalname,
    size: (req.file.size / 1024 / 1024).toFixed(2) + ' MB',
    type: path.extname(req.file.originalname).slice(1),
    url: `/uploads/${req.file.filename}`,
    dateAdded: new Date().toLocaleDateString()
  };
  files.push(newFile);
  
  // Increment fileCount in chapter
  const chap = chapters.find(c => c.id === req.params.id);
  if (chap) chap.fileCount += 1;

  res.status(201).json(newFile);
});

app.delete('/api/files/:id', (req, res) => {
  const file = files.find(f => f.id === req.params.id);
  if (file) {
    const chap = chapters.find(c => c.id === file.chapterId);
    if (chap) chap.fileCount = Math.max(0, chap.fileCount - 1);
  }
  files = files.filter(f => f.id !== req.params.id);
  res.status(204).send();
});

app.listen(3001, () => console.log('Server running on port 3001'));
