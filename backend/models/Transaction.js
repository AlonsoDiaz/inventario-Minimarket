const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'Efectivo'
    }
});

const TransactionItem = sequelize.define('TransactionItem', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Relationships
Transaction.hasMany(TransactionItem, { as: 'items' });
TransactionItem.belongsTo(Transaction);

module.exports = { Transaction, TransactionItem };
