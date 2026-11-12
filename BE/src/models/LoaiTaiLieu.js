const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const LoaiTaiLieu = sequelize.define('LoaiTaiLieu', {
    maLoai: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenLoai: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    moTa: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: 'LOAI_TAI_LIEU',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = LoaiTaiLieu;