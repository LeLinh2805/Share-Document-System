const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { PDFDocument } = require('pdf-lib');
const { TaiLieu, MonHoc, LoaiTaiLieu, TaiKhoan, LichSuTai } = require('../models/index');

// 1. Upload tai lieu
const uploadTaiLieu = async ({ maTK, maMonHoc, tenMonHocMoi, maLoai, tenTaiLieu, moTa, file }) => {
    if (!file) throw new Error('Vui lòng chọn file PDF để tải lên!');

    try {
        let finalMaMonHoc = maMonHoc;
        if (maMonHoc === 'other' || (!maMonHoc && tenMonHocMoi) || (tenMonHocMoi && tenMonHocMoi.trim())) {
            const tenClean = (tenMonHocMoi || '').trim();
            if (!tenClean) {
                throw new Error('Vui lòng nhập tên môn học mới!');
            }

            let monHoc = await MonHoc.findOne({
                where: {
                    tenMonHoc: { [Op.like]: tenClean }
                }
            });
            if (!monHoc) {
                monHoc = await MonHoc.create({
                    tenMonHoc: tenClean,
                    moTa: 'Môn học do sinh viên bổ sung khi đăng tài liệu'
                });
            }

            finalMaMonHoc = monHoc.maMonHoc;
        } else {
            const monHoc = await MonHoc.findByPk(finalMaMonHoc);
            if (!monHoc) throw new Error('Môn học không tồn tại!');
        }

        const loai = await LoaiTaiLieu.findByPk(maLoai);
        if (!loai) throw new Error('Loại tài liệu không tồn tại!');

        const fileBuffer = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const soTrang = pdfDoc.getPageCount();

        const duongDanFile = file.path.replace(/\\/g, '/');

        return await TaiLieu.create({
            maTK,
            maMonHoc: finalMaMonHoc,
            maLoai,
            tenTaiLieu,
            moTa,
            duongDanFile,
            soTrang,
            trangThai: 'PENDING',
            luotTai: 0,
            soDanhGia: 0
        });
    } catch (error) {
        if (file && file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (unlinkErr) {
                console.error('Không thể xóa file rác:', unlinkErr.message);
            }
        }
        throw error;
    }
};

// 2. Lay ds tai lieu cong khai
const layDanhSachTaiLieu = async ({ tuKhoa, maMonHoc, maLoai, sapXep, page = 1, limit = 10 }) => {
    const whereCondition = { trangThai: 'APPROVED' };

    // Tìm kiếm đa năng: Tên tài liệu, Mô tả, Tên môn học, Tên loại tài liệu
    if (tuKhoa && tuKhoa.trim()) {
        const cleanTuKhoa = tuKhoa.trim();
        whereCondition[Op.or] = [
            { tenTaiLieu: { [Op.like]: `%${cleanTuKhoa}%` } },
            { moTa: { [Op.like]: `%${cleanTuKhoa}%` } },
            { '$MonHoc.tenMonHoc$': { [Op.like]: `%${cleanTuKhoa}%` } },
            { '$LoaiTaiLieu.tenLoai$': { [Op.like]: `%${cleanTuKhoa}%` } }
        ];
    }
    if (maMonHoc) whereCondition.maMonHoc = maMonHoc;
    if (maLoai) whereCondition.maLoai = maLoai;

    let order = [['ngayUpload', 'DESC']];
    if (sapXep === 'taiNhieu') order = [['luotTai', 'DESC']];
    else if (sapXep === 'danhGiaCao') order = [['diemTrungBinh', 'DESC']];

    const trangHienTai = Math.max(1, parseInt(page));
    const soLuongMoiTrang = Math.max(1, parseInt(limit));
    const offset = (trangHienTai - 1) * soLuongMoiTrang;

    const { count, rows } = await TaiLieu.findAndCountAll({
        where: whereCondition,
        distinct: true,
        subQuery: false,
        order,
        limit: soLuongMoiTrang,
        offset,
        attributes: [
            'maTaiLieu', 'tenTaiLieu', 'moTa', 'soTrang', 
            'luotTai', 'diemTrungBinh', 'soDanhGia', 'ngayUpload'
        ],
        include: [
            { model: MonHoc, attributes: ['maMonHoc', 'tenMonHoc'] },
            { model: LoaiTaiLieu, attributes: ['maLoai', 'tenLoai'] },
            { model: TaiKhoan, as: 'nguoiDang', attributes: ['maTK', 'hoTen'] }
        ]
    });

    return {
        danhSach: rows,
        tongSo: count,
        trangHienTai,
        tongSoTrang: Math.ceil(count / soLuongMoiTrang)
    };
};

// 3. Xem tai lieu
const xemChiTietTaiLieu = async ({ maTaiLieu, user }) => {
    const taiLieu = await TaiLieu.findByPk(maTaiLieu, {
        attributes: [
            'maTaiLieu', 'maTK', 'tenTaiLieu', 'moTa', 'soTrang', 
            'trangThai', 'luotTai', 'diemTrungBinh', 'soDanhGia', 'ngayUpload'
        ],
        include: [
            { model: MonHoc, attributes: ['maMonHoc', 'tenMonHoc', 'moTa'] },
            { model: LoaiTaiLieu, attributes: ['maLoai', 'tenLoai', 'moTa'] },
            { model: TaiKhoan, as: 'nguoiDang', attributes: ['maTK', 'hoTen', 'email'] }
        ]
    });

    if (!taiLieu) throw new Error('Không tìm thấy tài liệu!');

    if (taiLieu.trangThai !== 'APPROVED') {
        const laAdmin = user && user.vaiTro === 'ADMIN';
        const laChuSoHuu = user && user.maTK === taiLieu.maTK;
        if (!laAdmin && !laChuSoHuu) {
            throw new Error('Tài liệu này hiện chưa được công khai!');
        }
    }

    return taiLieu;
};

// 4. Tai xuong tai lieu
const taiXuongTaiLieu = async ({ maTaiLieu, maTK }) => {
    const taiLieu = await TaiLieu.findOne({
        where: { maTaiLieu, trangThai: 'APPROVED' }
    });

    if (!taiLieu) throw new Error('Tài liệu không tồn tại hoặc chưa được duyệt!');

    const duongDanTuyetDoi = path.resolve(taiLieu.duongDanFile);
    if (!fs.existsSync(duongDanTuyetDoi)) {
        throw new Error('File tài liệu trên hệ thống đã bị thất lạc!');
    }

    await LichSuTai.create({
        maTK,
        maTaiLieu,
        ngayTai: new Date()
    });

    await taiLieu.increment('luotTai', { by: 1 });

    return {
        duongDanFile: duongDanTuyetDoi,
        tenFile: `${taiLieu.tenTaiLieu}.pdf`
    };
};

// 5. Xen pdf tai lieu
const xemPdfTaiLieu = async ({ maTaiLieu, user }) => {
    const taiLieu = await TaiLieu.findByPk(maTaiLieu);
    if (!taiLieu) throw new Error('Tài liệu không tồn tại!');

    const duongDanTuyetDoi = path.resolve(taiLieu.duongDanFile);
    if (!fs.existsSync(duongDanTuyetDoi)) {
        throw new Error('File không tồn tại trên hệ thống!');
    }

    const now = new Date();
    const laAdmin = user && user.vaiTro === 'ADMIN';
    const laChuSoHuu = user && user.maTK === taiLieu.maTK;
    const laPro = user && user.ngayHetHanPro && new Date(user.ngayHetHanPro) > now;
    const xemToanBo = laAdmin || laChuSoHuu || laPro;

    if (xemToanBo) {
        return {
            pdfBuffer: fs.readFileSync(duongDanTuyetDoi),
            laBanThu: false
        };
    }

    const fileGocBytes = fs.readFileSync(duongDanTuyetDoi);
    const pdfGoc = await PDFDocument.load(fileGocBytes);
    const tongSoTrang = pdfGoc.getPageCount();

    if (tongSoTrang <= 3) {
        return {
            pdfBuffer: fileGocBytes,
            laBanThu: false
        };
    }

    const pdfBanThu = await PDFDocument.create();
    const copiedPages = await pdfBanThu.copyPages(pdfGoc, [0, 1, 2]);
    copiedPages.forEach((page) => pdfBanThu.addPage(page));

    const pdfBanThuBytes = await pdfBanThu.save();

    return {
        pdfBuffer: Buffer.from(pdfBanThuBytes),
        laBanThu: true
    };
};
//6. Ql tai lieu cua ban than
const danhSachCuaToi = async ({ maTK }) => {
    return await TaiLieu.findAll({
        where: { maTK },
        order: [['ngayUpload', 'DESC']],
        include: [
            { model: MonHoc, attributes: ['maMonHoc', 'tenMonHoc'] },
            { model: LoaiTaiLieu, attributes: ['maLoai', 'tenLoai'] }
        ]
    });
};

const xoaTaiLieuCuaToi = async ({ maTaiLieu, maTK }) => {
    const taiLieu = await TaiLieu.findOne({
        where: { maTaiLieu, maTK }
    });

    if (!taiLieu) {
        throw new Error('Tài liệu không tồn tại hoặc bạn không có quyền xóa!');
    }

    await taiLieu.destroy();
    return true;
};

module.exports = {
    uploadTaiLieu,
    layDanhSachTaiLieu,
    xemChiTietTaiLieu,
    taiXuongTaiLieu,
    xemPdfTaiLieu,
    danhSachCuaToi,
    xoaTaiLieuCuaToi
};