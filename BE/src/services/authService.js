const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {TaiKhoan, XacThucTaiKhoan} = require('../models/index');

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

const dangKy = async ({hoTen, email, matKhau}) => {
    const daTonTai = await TaiKhoan.findOne({where: {email}})
    if(daTonTai) {
        throw new Error('Email đã được sử dụng');
    }

    const salt = await bcrypt.genSalt(10);
    const matKhauHash = await bcrypt.hash(matKhau, salt);

    //User dau tien dang ky se duoc cap quyen admin
    const soLuongTK = await TaiKhoan.count();
    const vaiTro = soLuongTK === 0 ? 'ADMIN' : 'USER';

    const taiKhoanMoi = await TaiKhoan.create({
        hoTen,
        email,
        matKhau: matKhauHash,
        vaiTro,
        emailDaXacThuc: false,
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    const thoiGianHetHan = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ hiệu lực

    await XacThucTaiKhoan.create({
        maTK: taiKhoanMoi.maTK,
        loaiXacThuc: 'VERIFY_EMAIL',
        token: hashedToken,
        thoiGianHetHan,
        daSuDung: false
    });

    return {taiKhoan: taiKhoanMoi, rawToken};
}


const xacThucEmail = async ({token}) => {
    const hashedToken = hashToken(token);

    const xacThuc = await XacThucTaiKhoan.findOne({
        where: {
            token: hashedToken,
            loaiXacThuc: 'VERIFY_EMAIL',
            daSuDung: false,
        }
    });

    if(!xacThuc) {
        throw new Error('Link xác thực không hợp lệ!');
    }

    if(new Date() > xacThuc.thoiGianHetHan) {
        throw new Error('Link xác thực đã hết hạn!');
    }

    await TaiKhoan.update({emailDaXacThuc: true}, {where: {maTK: xacThuc.maTK}});
    await xacThuc.update({daSuDung: true}); 
}

const guiLaiEmailXacThuc = async ({ email }) => {
    const taiKhoan = await TaiKhoan.findOne({ where: { email } });
    if (!taiKhoan) {
        throw new Error('Không tìm thấy tài khoản với email này!');
    }

    if (taiKhoan.emailDaXacThuc) {
        throw new Error('Tài khoản này đã được xác thực trước đó!');
    }

    // Xóa các token kích hoạt email cũ chưa sử dụng của tài khoản này
    await XacThucTaiKhoan.destroy({
        where: {
            maTK: taiKhoan.maTK,
            loaiXacThuc: 'VERIFY_EMAIL'
        }
    });

    // Tạo token xác thực mới
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    const thoiGianHetHan = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ hiệu lực

    await XacThucTaiKhoan.create({
        maTK: taiKhoan.maTK,
        loaiXacThuc: 'VERIFY_EMAIL',
        token: hashedToken,
        thoiGianHetHan,
        daSuDung: false
    });

    return {
        taiKhoan,
        rawToken
    };
};


const dangNhap = async ({email, matKhau}) => {
    const taiKhoan = await TaiKhoan.findOne({where: {email}});
    if(!taiKhoan) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    if(!taiKhoan.emailDaXacThuc) {
        throw new Error('Vui lòng xác thực email trước khi đăng nhập');
    }

    const isMatch = await bcrypt.compare(matKhau, taiKhoan.matKhau);
    if(!isMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }
    //tao jwt
    const token = jwt.sign(
        {maTK: taiKhoan.maTK, vaiTro: taiKhoan.vaiTro}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return {
        token,
        taiKhoan: {
            maTK: taiKhoan.maTK,
            hoTen: taiKhoan.hoTen,
            email: taiKhoan.email,
            vaiTro: taiKhoan.vaiTro,
            ngayHetHanPro: taiKhoan.ngayHetHanPro,
        }
    };
};


const quenMatKhau = async ({email}) => {
    const taiKhoan = await TaiKhoan.findOne({where: {email}});

    if(!taiKhoan) return null;

    await XacThucTaiKhoan.destroy({
        where: {
            maTK: taiKhoan.maTK,
            loaiXacThuc: 'RESET_PASSWORD'
        }
    });

    //tao token moi
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    const thoiGianHetHan = new Date(Date.now() + 15 * 60 * 1000); // 15 phút hiệu lực

    await XacThucTaiKhoan.create({
        maTK: taiKhoan.maTK,
        loaiXacThuc: 'RESET_PASSWORD',
        token: hashedToken,
        thoiGianHetHan,
        daSuDung: false
    });

    return {
        hoTen: taiKhoan.hoTen,
        email: taiKhoan.email,
        rawToken
    };
};


const datLaiMatKhau = async ({token, matKhauMoi}) => {
    const hashedToken = hashToken(token);

    const xacThuc = await XacThucTaiKhoan.findOne({
        where: {
            token: hashedToken,
            loaiXacThuc: 'RESET_PASSWORD',
            daSuDung: false
        }
    });

    if(!xacThuc) {
        throw new Error('Link đặt lại mật khẩu không hợp lệ!');
    }

    if(new Date() > xacThuc.thoiGianHetHan) {
        throw new Error('Link đặt lại mật khẩu đã hết hạn!');
    }

    const salt = await bcrypt.genSalt(10);
    const matKhauHash = await bcrypt.hash(matKhauMoi, salt);

    //update password
    await TaiKhoan.update(
        {matKhau: matKhauHash},
        {where: {maTK: xacThuc.maTK}}
    );

    await xacThuc.update({daSuDung: true});
};

module.exports = {
    dangKy,
    xacThucEmail,
    guiLaiEmailXacThuc,
    dangNhap,
    quenMatKhau,
    datLaiMatKhau
};