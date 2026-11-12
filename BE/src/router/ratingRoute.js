const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { xacThucToken } = require('../middlewares/authMiddleware');

router.post('/', xacThucToken, ratingController.danhGia);
router.get('/:maTaiLieu', xacThucToken, ratingController.layDanhGia);

module.exports = router;