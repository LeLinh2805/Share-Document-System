const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server đang chạy!' });
});

// Routes
app.use('/api/auth', require('./src/router/authRoute'));
app.use('/api/users', require('./src/router/userRoute'));
app.use('/api/categories', require('./src/router/categoryRoute'));
app.use('/api/documents', require('./src/router/documentRoute'));
app.use('/api/ratings', require('./src/router/ratingRoute'));
app.use('/api/pro', require('./src/router/proRoute'));
app.use('/api/admin', require('./src/router/adminRoute'));

app.use((err, req, res, next) => {
  console.error('Lỗi hệ thống:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
});

const sequelize = require('./src/config/db');
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Kết nối MySQL thành công!');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối DB:', err.message);
  });