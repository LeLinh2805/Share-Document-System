const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KiemDuyet = sequelize.define('KiemDuyet', {
    maKiemDuyet: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maTaiLieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TAI_LIEU',
            key: 'maTaiLieu'
        }
    },
    maAdmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TAI_KHOAN',
            key: 'maTK'
        }
    }, 
    trangThai: {
        type: DataTypes.ENUM('APPROVED', 'REJECTED'),
        allowNull: false
    },
    lyDo: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},{
    tableName: 'KIEM_DUYET',
    timestamps: true,
    createdAt: 'ngayKiemDuyet',
    updatedAt: false,
    paranoid: false
});

module.exports = KiemDuyet;