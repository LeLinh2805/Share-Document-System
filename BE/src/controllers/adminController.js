const adminService = require('../services/adminService');

// 1. Danh sách tài liệu chờ duyệt
const danhSachPending = async (req, res) => {
    try {
        const danhSach = await adminService.layDanhSachPending();
        return res.status(200).json({ success: true, data: danhSach });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Duyet tai lieu
const duyet = async (req, res) => {
    try {
        const { id } = req.params;
        const maAdmin = req.user.maTK;

        const ketQua = await adminService.duyetTaiLieu({ maTaiLieu: id, maAdmin });

        return res.status(200).json({
            success: true,
            message: 'Đã duyệt tài liệu thành công và cộng 2 ngày Pro cho tác giả!',
            data: ketQua
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Từ chối tài liệu
const tuChoi = async (req, res) => {
    try {
        const { id } = req.params;
        const { lyDo } = req.body;
        const maAdmin = req.user.maTK;

        const ketQua = await adminService.tuChoiTaiLieu({ maTaiLieu: id, maAdmin, lyDo });

        return res.status(200).json({
            success: true,
            message: 'Đã từ chối tài liệu kèm lý do.',
            data: ketQua
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Danh sách người dùng
const danhSachUsers = async (req, res) => {
    try {
        const danhSach = await adminService.layDanhSachNguoiDung();
        return res.status(200).json({ success: true, data: danhSach });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Thống kê Dashboard
const thongKe = async (req, res) => {
    try {
        const stats = await adminService.thongKeTongQuan();
        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    danhSachPending,
    duyet,
    tuChoi,
    danhSachUsers,
    thongKe
};