const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { xacThucToken } = require('../middlewares/authMiddleware');

router.use(xacThucToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.get('/downloads', userController.getDownloadHistory);

module.exports = router;

