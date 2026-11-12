const proService = require('../services/proService');

// 1. Lấy danh sách các gói Pro
const danhSachGoi = async (req, res) => {
    try {
        const danhSach = await proService.layDanhSachGoiPro();
        return res.status(200).json({
            success: true,
            data: danhSach
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Tạo đơn hàng mua gói Pro
const taoDonHang = async (req, res) => {
    try {
        const { maGoi } = req.body;
        const maTK = req.user.maTK;

        if (!maGoi) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn gói Pro muốn mua!'
            });
        }

        const ketQua = await proService.taoDonHang({ maTK, maGoi });

        return res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công! Vui lòng tiến hành thanh toán.',
            data: ketQua
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Thanh toán đơn hàng
const thanhToan = async (req, res) => {
    try {
        const { maDonHang, phuongThuc } = req.body;
        const maTK = req.user.maTK;

        if (!maDonHang) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mã đơn hàng cần thanh toán!'
            });
        }

        const ketQua = await proService.thanhToanDonHang({
            maDonHang,
            maTK,
            phuongThuc: phuongThuc || 'VNPAY'
        });

        return res.status(200).json({
            success: true,
            message: 'Thanh toán thành công! Tài khoản của bạn đã được nâng cấp Pro.',
            data: ketQua
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 4. Lịch sử đơn hàng của tôi
const lichSu = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const danhSach = await proService.layLichSuDonHang({ maTK });

        return res.status(200).json({
            success: true,
            data: danhSach
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    danhSachGoi,
    taoDonHang,
    thanhToan,
    lichSu
};