const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { xacThucToken, xacThucTuyChon } = require('../middlewares/authMiddleware');
const { ktraPro } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', documentController.layDanhSach);
router.get('/my-documents', xacThucToken, documentController.danhSachCuaToi);
router.post('/upload', xacThucToken, upload.single('file'), documentController.upload);
router.get('/:id', xacThucTuyChon, documentController.xemChiTiet);
router.get('/:id/pdf', xacThucTuyChon, documentController.xemPdf);
router.get('/:id/download', xacThucToken, ktraPro, documentController.taiXuong);
router.delete('/:id', xacThucToken, documentController.xoaTaiLieu);

module.exports = router;