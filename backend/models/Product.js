const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General'
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Product;
