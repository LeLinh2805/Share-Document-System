const userService = require('../services/userService');

const getProfile = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const profile = await userService.xemThongTin({ maTK });
        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const { hoTen } = req.body;
        const result = await userService.capNhatThongTin({ maTK, hoTen });
        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công!',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const { matKhauCu, matKhauMoi } = req.body;
        await userService.doiMatKhau({ maTK, matKhauCu, matKhauMoi });
        return res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công!'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDownloadHistory = async (req, res) => {
    try {
        const maTK = req.user.maTK;
        const history = await userService.layLichSuTai({ maTK });
        return res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getDownloadHistory
};

