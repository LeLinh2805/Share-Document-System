const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const DanhGia = sequelize.define('DanhGia', {
    maDanhGia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    maTK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'TAI_KHOAN',
            key: 'maTK'
        }
    },
    maTaiLieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'TAI_LIEU',
            key: 'maTaiLieu'
        }
    },
    soSao: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    tableName: 'DANH_GIA',
    timestamps: true,
    createdAt: 'ngayTao',
    updatedAt: 'ngayCapNhat',
    paranoid: true,
    deletedAt: 'ngayXoa',
    indexes: [
        {
            unique: true,
            fields: ['maTK', 'maTaiLieu']
        }
    ]
});

module.exports = DanhGia;