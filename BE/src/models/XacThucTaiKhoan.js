const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const XacThucTaiKhoan = sequelize.define('XacThucTaiKhoan',{
    maXacThuc: {
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
    loaiXacThuc: {
        type: DataTypes.ENUM('VERIFY_EMAIL', 'RESET_PASSWORD'),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    thoiGianHetHan: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    daSuDung: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    tableName: 'XAC_THUC_TAI_KHOAN',
    timestamps: true
})

module.exports = XacThucTaiKhoan;