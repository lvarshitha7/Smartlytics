const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function connectToMongo() {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_FALLBACK_URI || 'mongodb://127.0.0.1:27017/smartlytics';

  if (!primaryUri) {
    console.warn('⚠️ MONGODB_URI is missing. Trying fallback URI...');
    await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB connected (fallback)');
    return;
  }

  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected (primary)');
  } catch (err) {
    const isSrvDnsError = err?.code === 'ECONNREFUSED' && String(err?.hostname || '').includes('_mongodb._tcp.');
    console.error('❌ Primary MongoDB connection failed:', err.message);

    if (isSrvDnsError) {
      console.warn('⚠️ Atlas DNS SRV lookup failed. Trying fallback local MongoDB URI...');
    } else {
      console.warn('⚠️ Trying fallback MongoDB URI...');
    }

    await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB connected (fallback)');
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/datasets', require('./routes/datasets'));
app.use('/api/dashboards', require('./routes/dashboards'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
connectToMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB error (all connection attempts failed):', err.message);
    process.exit(1);
  });
