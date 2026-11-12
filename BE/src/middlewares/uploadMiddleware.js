const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/documents'));
    },

    filename: (req, file, cb) => {
        const thoiGian = Date.now(); 
        const tenGoc = file.originalname;     
        const tenFile = `${thoiGian}_${tenGoc}`; 
        cb(null, tenFile);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Hệ thống chỉ chấp nhận file định dạng PDF!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;