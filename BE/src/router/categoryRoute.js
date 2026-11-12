const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/subjects', categoryController.layDanhSachMonHoc);
router.get('/types', categoryController.layDanhSachLoaiTaiLieu);

module.exports = router;

