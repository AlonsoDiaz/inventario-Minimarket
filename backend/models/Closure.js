const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Closure = sequelize.define('Closure', {
    date: {
        type: DataTypes.DATEONLY, // Store only the date part
        allowNull: false,
        unique: true
    },
    systemTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    systemCash: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    systemCard: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    systemTransfer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    countedCash: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    difference: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Closure;
