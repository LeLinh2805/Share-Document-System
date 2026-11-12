const bcrypt = require('bcryptjs');
const { TaiKhoan, TaiLieu, LichSuTai, MonHoc } = require('../models/index');

const xemThongTin = async ({ maTK }) => {
    const taiKhoan = await TaiKhoan.findByPk(maTK, {
        attributes: ['maTK', 'hoTen', 'email', 'vaiTro', 'emailDaXacThuc', 'ngayHetHanPro', 'ngayTao']
    });

    if (!taiKhoan) throw new Error('Tài khoản không tồn tại!');

    const soTaiLieuDaDang = await TaiLieu.count({ where: { maTK } });
    const soLuotTai = await LichSuTai.count({ where: { maTK } });

    const now = new Date();
    const laPro = taiKhoan.ngayHetHanPro && new Date(taiKhoan.ngayHetHanPro) > now;

    return {
        ...taiKhoan.toJSON(),
        laPro: !!laPro,
        soTaiLieuDaDang,
        soLuotTai
    };
};

const capNhatThongTin = async ({ maTK, hoTen }) => {
    if (!hoTen || !hoTen.trim()) {
        throw new Error('Họ tên không được để trống!');
    }

    const taiKhoan = await TaiKhoan.findByPk(maTK);
    if (!taiKhoan) throw new Error('Tài khoản không tồn tại!');

    taiKhoan.hoTen = hoTen.trim();
    await taiKhoan.save();

    return {
        maTK: taiKhoan.maTK,
        hoTen: taiKhoan.hoTen,
        email: taiKhoan.email
    };
};

const doiMatKhau = async ({ maTK, matKhauCu, matKhauMoi }) => {
    if (!matKhauCu || !matKhauMoi) {
        throw new Error('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!');
    }

    if (matKhauMoi.length < 6) {
        throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự!');
    }

    const taiKhoan = await TaiKhoan.findByPk(maTK);
    if (!taiKhoan) throw new Error('Tài khoản không tồn tại!');

    const isMatch = await bcrypt.compare(matKhauCu, taiKhoan.matKhau);
    if (!isMatch) {
        throw new Error('Mật khẩu hiện tại không chính xác!');
    }

    const salt = await bcrypt.genSalt(10);
    taiKhoan.matKhau = await bcrypt.hash(matKhauMoi, salt);
    await taiKhoan.save();

    return true;
};

// 4. Lịch sử tải tài liệu của tôi
const layLichSuTai = async ({ maTK }) => {
    return await LichSuTai.findAll({
        where: { maTK },
        order: [['ngayTai', 'DESC']],
        include: [
            {
                model: TaiLieu,
                attributes: ['maTaiLieu', 'tenTaiLieu', 'soTrang', 'luotTai'],
                include: [
                    { model: MonHoc, attributes: ['maMonHoc', 'tenMonHoc'] }
                ]
            }
        ]
    });
};

module.exports = {
    xemThongTin,
    capNhatThongTin,
    doiMatKhau,
    layLichSuTai
};

