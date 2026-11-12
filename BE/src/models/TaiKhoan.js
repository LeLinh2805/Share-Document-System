const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const TaiKhoan = sequelize.define('TaiKhoan',{
    maTK: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hoTen: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    matKhau: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    vaiTro: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER'
    },
    emailDaXacThuc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ngayHetHanPro: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'TAI_KHOAN',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = TaiKhoan;