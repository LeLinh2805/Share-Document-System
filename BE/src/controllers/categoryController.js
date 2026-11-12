const { MonHoc, LoaiTaiLieu } = require('../models/index');

// 1. Lay ds mon hoc
const layDanhSachMonHoc = async (req, res) => {
    try {
        const danhSach = await MonHoc.findAll({
            attributes: ['maMonHoc', 'tenMonHoc', 'moTa'],
            order: [['tenMonHoc', 'ASC']]
        });
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

// 2. Lay ds loai tai lieu
const layDanhSachLoaiTaiLieu = async (req, res) => {
    try {
        const danhSach = await LoaiTaiLieu.findAll({
            attributes: ['maLoai', 'tenLoai', 'moTa'],
            order: [['tenLoai', 'ASC']]
        });
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
    layDanhSachMonHoc,
    layDanhSachLoaiTaiLieu
};

