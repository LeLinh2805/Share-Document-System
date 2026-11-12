const TaiKhoan = require('./TaiKhoan');
const XacThucTaiKhoan = require('./XacThucTaiKhoan');
const MonHoc = require('./MonHoc');
const LoaiTaiLieu = require('./LoaiTaiLieu');
const TaiLieu = require('./TaiLieu');
const DanhGia = require('./DanhGia');
const KiemDuyet = require('./KiemDuyet');
const LichSuTai = require('./LichSuTai');
const GoiPro = require('./GoiPro');
const DonHang = require('./DonHang');
const GiaoDich = require('./GiaoDich');

// TaiKhoan
TaiKhoan.hasMany(XacThucTaiKhoan, { foreignKey: 'maTK' });
XacThucTaiKhoan.belongsTo(TaiKhoan, { foreignKey: 'maTK' });

TaiKhoan.hasMany(TaiLieu, { foreignKey: 'maTK' });
TaiLieu.belongsTo(TaiKhoan, { foreignKey: 'maTK', as: 'nguoiDang' });

TaiKhoan.hasMany(DanhGia, { foreignKey: 'maTK' });
DanhGia.belongsTo(TaiKhoan, { foreignKey: 'maTK' });

TaiKhoan.hasMany(LichSuTai, { foreignKey: 'maTK' });
LichSuTai.belongsTo(TaiKhoan, { foreignKey: 'maTK' });

TaiKhoan.hasMany(DonHang, { foreignKey: 'maTK' });
DonHang.belongsTo(TaiKhoan, { foreignKey: 'maTK' });

// Admin
TaiKhoan.hasMany(KiemDuyet, { foreignKey: 'maAdmin', as: 'kiemDuyetThucHien' });
KiemDuyet.belongsTo(TaiKhoan, { foreignKey: 'maAdmin', as: 'admin' });

// MonHoc-LoaiTaiLieu
MonHoc.hasMany(TaiLieu, { foreignKey: 'maMonHoc' });
TaiLieu.belongsTo(MonHoc, { foreignKey: 'maMonHoc' });

LoaiTaiLieu.hasMany(TaiLieu, { foreignKey: 'maLoai' });
TaiLieu.belongsTo(LoaiTaiLieu, { foreignKey: 'maLoai' });

// TaiLieu
TaiLieu.hasMany(DanhGia, { foreignKey: 'maTaiLieu' });
DanhGia.belongsTo(TaiLieu, { foreignKey: 'maTaiLieu' });

TaiLieu.hasMany(KiemDuyet, { foreignKey: 'maTaiLieu' });
KiemDuyet.belongsTo(TaiLieu, { foreignKey: 'maTaiLieu' });

TaiLieu.hasMany(LichSuTai, { foreignKey: 'maTaiLieu' });
LichSuTai.belongsTo(TaiLieu, { foreignKey: 'maTaiLieu' });

// GoiPro-DonHang
GoiPro.hasMany(DonHang, { foreignKey: 'maGoi' });
DonHang.belongsTo(GoiPro, { foreignKey: 'maGoi' });

// DonHang-GiaoDich 
DonHang.hasMany(GiaoDich, { foreignKey: 'maDonHang' });
GiaoDich.belongsTo(DonHang, { foreignKey: 'maDonHang' });

module.exports = {
    TaiKhoan,
    XacThucTaiKhoan,
    MonHoc,
    LoaiTaiLieu,
    TaiLieu,
    DanhGia,
    KiemDuyet,
    LichSuTai,
    GoiPro,
    DonHang,
    GiaoDich
};