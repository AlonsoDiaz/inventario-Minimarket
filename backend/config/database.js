const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'), // Store in backend root
    logging: false // Disable SQL logging for cleaner console
});

module.exports = sequelize;
