const { DanhGia, TaiLieu, TaiKhoan } = require('../models/index');
const { fn, col } = require('sequelize');

const danhGiaTaiLieu = async ({ maTK, maTaiLieu, soSao }) => {
    if (!soSao || soSao < 1 || soSao > 5) {
        throw new Error('Số sao đánh giá phải từ 1 đến 5!');
    }

    const taiLieu = await TaiLieu.findOne({
        where: { maTaiLieu, trangThai: 'APPROVED' }
    });

    if (!taiLieu) {
        throw new Error('Tài liệu không tồn tại hoặc chưa được duyệt!');
    }

    if (taiLieu.maTK === maTK) {
        throw new Error('Bạn không thể tự đánh giá tài liệu do chính mình đăng tải!');
    }
    let danhGia = await DanhGia.findOne({
        where: { maTK, maTaiLieu }
    });

    if (danhGia) {
        danhGia.soSao = soSao;
        danhGia.ngayCapNhat = new Date();
        await danhGia.save();
    } else {
        danhGia = await DanhGia.create({
            maTK,
            maTaiLieu,
            soSao,
            ngayTao: new Date()
        });
    }

    const thongKe = await DanhGia.findOne({
        where: { maTaiLieu },
        attributes: [
            [fn('AVG', col('soSao')), 'diemTrungBinh'],
            [fn('COUNT', col('maDanhGia')), 'soDanhGia']
        ],
        raw: true
    });

    const diemTB = parseFloat(thongKe.diemTrungBinh).toFixed(2);
    const tongDG = parseInt(thongKe.soDanhGia);
    taiLieu.diemTrungBinh = diemTB;
    taiLieu.soDanhGia = tongDG;
    await taiLieu.save();

    return {
        danhGia,
        diemTrungBinhMoi: diemTB,
        tongSoDanhGiaMoi: tongDG
    };
};

const layDanhSachDanhGia = async ({ maTaiLieu }) => {
    return await DanhGia.findAll({
        where: { maTaiLieu },
        order: [['ngayTao', 'DESC']],
        include: [
            {
                model: TaiKhoan,
                attributes: ['maTK', 'hoTen']
            }
        ]
    });
};

module.exports = {
    danhGiaTaiLieu,
    layDanhSachDanhGia
};