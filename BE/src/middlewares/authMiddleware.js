const jwt = require('jsonwebtoken');
const { TaiKhoan } = require('../models/index');

// Middleware bắt buộc phải đăng nhập
const xacThucToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện chức năng này!' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const taiKhoan = await TaiKhoan.findByPk(decoded.maTK, {
            attributes: ['maTK', 'hoTen', 'email', 'vaiTro', 'ngayHetHanPro', 'emailDaXacThuc']
        });

        if (!taiKhoan) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }
        req.user = taiKhoan;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!' });
    }
};

// Middleware tùy chọn: Nếu có token thì lấy thông tin user, không có token thì vẫn cho qua (cho khách vãng lai)
const xacThucTuyChon = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const taiKhoan = await TaiKhoan.findByPk(decoded.maTK, {
            attributes: ['maTK', 'hoTen', 'email', 'vaiTro', 'ngayHetHanPro', 'emailDaXacThuc']
        });
        req.user = taiKhoan || null;
    } catch (error) {
        req.user = null; // Token lỗi hoặc hết hạn thì xem như khách vãng lai
    }
    next();
};

module.exports = { xacThucToken, xacThucTuyChon };