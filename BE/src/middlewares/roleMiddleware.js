const ktraAdmin = (req, res, next) => {
    if(req.user.vaiTro !== 'ADMIN') {
        return res.status(403).json({success: false, message: 'Ban khong co quyen truy cap'});
    }
    next();
};

const ktraPro = (req, res, next) => {
    const now = new Date();
    const hetHanPro = req.user.ngayHetHanPro;

    const isPro = hetHanPro && new Date(hetHanPro) > now;
    if(!isPro) {
        return res.status(403).json({success: false, message: 'Ban khong co quyen truy cap'});
    }
    next();
};

module.exports = {ktraAdmin, ktraPro};