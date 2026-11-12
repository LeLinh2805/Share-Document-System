const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { xacThucToken } = require('../middlewares/authMiddleware');
const { ktraAdmin } = require('../middlewares/roleMiddleware');

router.use(xacThucToken, ktraAdmin);
router.get('/stats', adminController.thongKe);
router.get('/users', adminController.danhSachUsers);
router.get('/documents/pending', adminController.danhSachPending);

router.put('/documents/:id/approve', adminController.duyet);
router.put('/documents/:id/reject', adminController.tuChoi);

module.exports = router;