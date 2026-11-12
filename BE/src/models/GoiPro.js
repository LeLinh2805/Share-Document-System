const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GoiPro = sequelize.define('GoiPro', {
    maGoi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenGoi: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    thoiHan: {
        type: DataTypes.INTEGER,  //1, 7, 30
        allowNull: false
    },
    giaTien: {
        type: DataTypes.DECIMAL(12, 2), 
        allowNull: false
    },
    trangThai: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'GOI_PRO',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = GoiPro;