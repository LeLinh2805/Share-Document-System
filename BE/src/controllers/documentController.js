const documentService = require('../services/documentService');

const upload = async (req, res) => {
    try {
        const { maMonHoc, maLoai, tenTaiLieu, moTa, tenMonHocMoi } = req.body;
        const maTK = req.user.maTK; 
        const file = req.file;      

        if (!tenTaiLieu || (!maMonHoc && !tenMonHocMoi) || !maLoai) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên tài liệu, môn học và loại tài liệu!'
            });
        }

        const taiLieuMoi = await documentService.uploadTaiLieu({
            maTK,
            maMonHoc,
            tenMonHocMoi,
            maLoai,
            tenTaiLieu,
            moTa,
            file
        });

        return res.status(201).json({
            success: true,
            message: 'Tải tài liệu lên thành công! Vui lòng chờ Admin duyệt.',
            data: taiLieuMoi
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh sách tài liệu công khai
const layDanhSach = async (req, res) => {
    try {
        const { tuKhoa, maMonHoc, maLoai, sapXep, page, limit } = req.query;

        const ketQua = await documentService.layDanhSachTaiLieu({
            tuKhoa,
            maMonHoc,
            maLoai,
            sapXep,
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            data: ketQua
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Xem thông tin chi tiết một tài liệu
const xemChiTiet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user; // Có thể có hoặc không (nếu là khách vãng lai)

        const taiLieu = await documentService.xemChiTietTaiLieu({
            maTaiLieu: id,
            user
        });

        return res.status(200).json({
            success: true,
            data: taiLieu
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Free xem 3 trang dau cua pdf, Pro xem full pdf
const xemPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const { pdfBuffer, laBanThu } = await documentService.xemPdfTaiLieu({
            maTaiLieu: id,
            user
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
        res.setHeader('X-Is-Preview', laBanThu ? 'true' : 'false');

        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//pro tai xuong tai lieu
const taiXuong = async (req, res) => {
    try {
        const { id } = req.params;
        const maTK = req.user.maTK;

        const { duongDanFile, tenFile } = await documentService.taiXuongTaiLieu({
            maTaiLieu: id,
            maTK
        });
        return res.download(duongDanFile, tenFile);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Ds tai lieu cua minh
const danhSachCuaToi = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const danhSach = await documentService.danhSachCuaToi({ maTK });

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

// xoa tai lieu cua minh
const xoaTaiLieu = async (req, res) => {
    try {
        const { id } = req.params;
        const maTK = req.user.maTK;

        await documentService.xoaTaiLieuCuaToi({ maTaiLieu: id, maTK });

        return res.status(200).json({
            success: true,
            message: 'Đã xóa tài liệu thành công!'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    upload,
    layDanhSach,
    xemChiTiet,
    xemPdf,
    taiXuong,
    danhSachCuaToi,
    xoaTaiLieu
};