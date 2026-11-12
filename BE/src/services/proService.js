const crypto = require('crypto');
const { GoiPro, DonHang, GiaoDich, TaiKhoan } = require('../models/index');
const sequelize = require('../config/db');

const layDanhSachGoiPro = async () => {
    return await GoiPro.findAll({
        where: { trangThai: true },
        order: [['thoiHan', 'ASC']]
    });
};

const taoDonHang = async ({ maTK, maGoi }) => {
    const goi = await GoiPro.findOne({
        where: { maGoi, trangThai: true }
    });

    if (!goi) {
        throw new Error('Gói Pro không tồn tại hoặc đã ngừng cung cấp!');
    }

    const donHangMoi = await DonHang.create({
        maTK,
        maGoi,
        soTien: goi.giaTien,
        trangThai: 'PENDING',
        ngayTao: new Date()
    });

    return {
        donHang: donHangMoi,
        thongTinGoi: goi
    };
};

const thanhToanDonHang = async ({ maDonHang, maTK, phuongThuc = 'VNPAY' }) => {
    return await sequelize.transaction(async (t) => {
        const donHang = await DonHang.findOne({
            where: { maDonHang, maTK, trangThai: 'PENDING' },
            include: [{ model: GoiPro }],
            transaction: t
        });

        if (!donHang) {
            throw new Error('Đơn hàng không tồn tại hoặc đã được xử lý rồi!');
        }

        const goi = donHang.GoiPro;
        const thoiHanNgay = goi.thoiHan;
        const maGiaoDichThanhToan = `PAY_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const giaoDich = await GiaoDich.create({
            maDonHang: donHang.maDonHang,
            maGiaoDichThanhToan,
            soTien: donHang.soTien,
            phuongThuc,
            trangThai: 'SUCCESS',
            ngayGiaoDich: new Date()
        }, { transaction: t });

        donHang.trangThai = 'PAID';
        await donHang.save({ transaction: t });

        const taiKhoan = await TaiKhoan.findByPk(maTK, { transaction: t });
        const now = new Date();
        let hanProMoi;
        if (taiKhoan.ngayHetHanPro && new Date(taiKhoan.ngayHetHanPro) > now) {
            hanProMoi = new Date(taiKhoan.ngayHetHanPro);
        } else {
            hanProMoi = new Date(now);
        }

        hanProMoi.setDate(hanProMoi.getDate() + thoiHanNgay);

        taiKhoan.ngayHetHanPro = hanProMoi;
        await taiKhoan.save({ transaction: t });

        return {
            donHang,
            giaoDich,
            ngayHetHanProMoi: hanProMoi
        };
    });
};

const layLichSuDonHang = async ({ maTK }) => {
    return await DonHang.findAll({
        where: { maTK },
        order: [['ngayTao', 'DESC']],
        include: [
            { model: GoiPro, attributes: ['maGoi', 'tenGoi', 'thoiHan'] },
            { model: GiaoDich, attributes: ['maGiaoDich', 'maGiaoDichThanhToan', 'phuongThuc', 'trangThai', 'ngayGiaoDich'] }
        ]
    });
};

module.exports = {
    layDanhSachGoiPro,
    taoDonHang,
    thanhToanDonHang,
    layLichSuDonHang
};