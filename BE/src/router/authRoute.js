const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.dangKy);
router.get("/verify-email/:token", authController.xacThucEmail);
router.post("/resend-verification", authController.guiLaiEmailXacThuc);
router.post("/login", authController.dangNhap);
router.post("/forgot-password", authController.quenMatKhau);
router.post("/reset-password", authController.datLaiMatKhau);

module.exports = router;