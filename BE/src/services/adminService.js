const { TaiLieu, TaiKhoan, MonHoc, LoaiTaiLieu, KiemDuyet, DonHang } = require('../models/index');
const sequelize = require('../config/db');

// 1. PENDING
const layDanhSachPending = async () => {
    return await TaiLieu.findAll({
        where: { trangThai: 'PENDING' },
        order: [['ngayUpload', 'ASC']],
        include: [
            { model: MonHoc, attributes: ['maMonHoc', 'tenMonHoc'] },
            { model: LoaiTaiLieu, attributes: ['maLoai', 'tenLoai'] },
            { model: TaiKhoan, as: 'nguoiDang', attributes: ['maTK', 'hoTen', 'email'] }
        ]
    });
};

// 2. APPROVED
const duyetTaiLieu = async ({ maTaiLieu, maAdmin }) => {
    return await sequelize.transaction(async (t) => {
        const taiLieu = await TaiLieu.findByPk(maTaiLieu, { transaction: t });
        if (!taiLieu) throw new Error('Tài liệu không tồn tại!');

        if (taiLieu.trangThai === 'APPROVED') {
            throw new Error('Tài liệu này đã được duyệt trước đó rồi!');
        }
        taiLieu.trangThai = 'APPROVED';
        await taiLieu.save({ transaction: t });
        await KiemDuyet.create({
            maTaiLieu,
            maAdmin,
            trangThai: 'APPROVED',
            lyDo: 'Tài liệu hợp lệ, đạt tiêu chuẩn',
            ngayKiemDuyet: new Date()
        }, { transaction: t });

        const nguoiDang = await TaiKhoan.findByPk(taiLieu.maTK, { transaction: t });
        const now = new Date();
        let hanProMoi;

        if (nguoiDang.ngayHetHanPro && new Date(nguoiDang.ngayHetHanPro) > now) {
            hanProMoi = new Date(nguoiDang.ngayHetHanPro);
        } else {
            hanProMoi = new Date(now);
        }

        hanProMoi.setDate(hanProMoi.getDate() + 2);
        nguoiDang.ngayHetHanPro = hanProMoi;
        await nguoiDang.save({ transaction: t });

        return {
            taiLieu,
            nguoiDang: {
                maTK: nguoiDang.maTK,
                hoTen: nguoiDang.hoTen,
                ngayHetHanProMoi: hanProMoi
            }
        };
    });
};

// 3. REJECTED
const tuChoiTaiLieu = async ({ maTaiLieu, maAdmin, lyDo }) => {
    return await sequelize.transaction(async (t) => {
        const taiLieu = await TaiLieu.findByPk(maTaiLieu, { transaction: t });
        if (!taiLieu) throw new Error('Tài liệu không tồn tại!');

        if (!lyDo || !lyDo.trim()) {
            throw new Error('Vui lòng nhập lý do từ chối tài liệu!');
        }

        taiLieu.trangThai = 'REJECTED';
        await taiLieu.save({ transaction: t });

        await KiemDuyet.create({
            maTaiLieu,
            maAdmin,
            trangThai: 'REJECTED',
            lyDo: lyDo.trim(),
            ngayKiemDuyet: new Date()
        }, { transaction: t });

        return taiLieu;
    });
};

// 4. Lấy danh sách tất cả người dùng trong hệ thống
const layDanhSachNguoiDung = async () => {
    return await TaiKhoan.findAll({
        attributes: ['maTK', 'hoTen', 'email', 'vaiTro', 'emailDaXacThuc', 'ngayHetHanPro', 'ngayTao'],
        order: [['ngayTao', 'DESC']]
    });
};

// 5. Thống kê tổng quan cho Admin
const thongKeTongQuan = async () => {
    const tongNguoiDung = await TaiKhoan.count();
    const tongTaiLieu = await TaiLieu.count();
    const tongChoDuyet = await TaiLieu.count({ where: { trangThai: 'PENDING' } });
    const tongDaDuyet = await TaiLieu.count({ where: { trangThai: 'APPROVED' } });
    const tongBiTuChoi = await TaiLieu.count({ where: { trangThai: 'REJECTED' } });

    const donHangDaThanhToan = await DonHang.findAll({
        where: { trangThai: 'PAID' },
        attributes: ['soTien']
    });
    const tongDoanhThu = donHangDaThanhToan.reduce((tong, dh) => tong + parseFloat(dh.soTien), 0);

    return {
        tongNguoiDung,
        tongTaiLieu,
        tongChoDuyet,
        tongDaDuyet,
        tongBiTuChoi,
        tongDoanhThu
    };
};

module.exports = {
    layDanhSachPending,
    duyetTaiLieu,
    tuChoiTaiLieu,
    layDanhSachNguoiDung,
    thongKeTongQuan
};