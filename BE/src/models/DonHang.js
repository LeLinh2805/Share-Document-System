const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const DonHang = sequelize.define('DonHang', {
    maDonHang: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maTK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TAI_KHOAN',
            key: 'maTK'
        }
    },
    maGoi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'GOI_PRO',
            key: 'maGoi'
        }
    },
    soTien: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false    
    },
    trangThai: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
}, {
    tableName: 'DON_HANG',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = DonHang;