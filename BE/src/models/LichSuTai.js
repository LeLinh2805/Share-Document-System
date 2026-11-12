const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LichSuTai = sequelize.define('LichSuTai', {
    maLichSu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maTK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'TAI_KHOAN', key: 'maTK' }
    },
    maTaiLieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'TAI_LIEU', key: 'maTaiLieu' }
    }
}, {
    tableName: 'LICH_SU_TAI',
    timestamps: true,
    createdAt: 'ngayTai',
    updatedAt: false,
    paranoid: false
});

module.exports = LichSuTai;