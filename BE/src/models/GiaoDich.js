const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const GiaoDich = sequelize.define('GiaoDich', {
    maGiaoDich: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maDonHang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'DON_HANG',
            key: 'maDonHang'
        }
    },
    maGiaoDichThanhToan: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }, 
    soTien: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    trangThai: {
        type: DataTypes.ENUM('SUCCESS', 'FAILED'),
        allowNull: false   
    },
    phuongThuc: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'GIAO_DICH',
    timestamps: true,
    createdAt: 'ngayGiaoDich',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = GiaoDich;