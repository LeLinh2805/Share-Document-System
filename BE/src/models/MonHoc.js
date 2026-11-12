const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const MonHoc = sequelize.define('MonHoc', {
    maMonHoc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenMonHoc: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    moTa: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'MON_HOC',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: false,
    paranoid: true,
    deletedAt: 'ngayXoa'
});

module.exports = MonHoc;