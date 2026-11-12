const ratingService = require('../services/ratingService');

const danhGia = async (req, res) => {
    try {
        const { maTaiLieu, soSao } = req.body;
        const maTK = req.user.maTK;

        if (!maTaiLieu) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mã tài liệu cần đánh giá!'
            });
        }

        const ketQua = await ratingService.danhGiaTaiLieu({
            maTK,
            maTaiLieu,
            soSao: parseInt(soSao)
        });

        return res.status(200).json({
            success: true,
            message: 'Đánh giá tài liệu thành công!',
            data: ketQua
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const layDanhGia = async (req, res) => {
    try {
        const { maTaiLieu } = req.params;
        const danhSach = await ratingService.layDanhSachDanhGia({ maTaiLieu });

        return res.status(200).json({
            success: true,
            data: danhSach
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    danhGia,
    layDanhGia
};