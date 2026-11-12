const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');
const { xacThucToken } = require('../middlewares/authMiddleware');

router.get('/packages', proController.danhSachGoi);
router.post('/orders', xacThucToken, proController.taoDonHang);
router.post('/pay', xacThucToken, proController.thanhToan);
router.get('/my-orders', xacThucToken, proController.lichSu);

module.exports = router;