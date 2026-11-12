const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const TaiLieu = sequelize.define('TaiLieu', {
    maTaiLieu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    //FK
    maTK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'TAI_KHOAN',
            key: 'maTK'
        }
    },
    maMonHoc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'MON_HOC',
            key: 'maMonHoc'
        }
    },
    maLoai: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'LOAI_TAI_LIEU',
            key: 'maLoai'
        }
    },
    //Thong tin tai lieu
    tenTaiLieu: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    moTa: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    duongDanFile: {
        type: DataTypes.STRING(500),
        allowNull: false    
    },
    soTrang: {
        type: DataTypes.INTEGER,
        allowNull: true 
    },
    //Trang thai kieem duyet
    trangThai: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    //Thong ke
    luotTai: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    diemTrungBinh: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: null
    },
    soDanhGia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'TAI_LIEU',
    timestamps: true,
    createdAt: 'ngayUpload',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = TaiLieu;