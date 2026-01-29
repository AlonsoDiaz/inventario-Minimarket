const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

// Models
const Product = require('./models/Product');
const { Transaction, TransactionItem } = require('./models/Transaction');
const Closure = require('./models/Closure');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes - PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.update(req.body, { where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products/stock', async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const product = await Product.findByPk(id);
        if (product) {
            product.stock -= quantity;
            await product.save();
            res.json({ success: true, newStock: product.stock });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes - TRANSACTIONS
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [{ model: TransactionItem, as: 'items' }],
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { total, items, paymentMethod, date } = req.body;

        const newTransaction = await Transaction.create({
            total,
            paymentMethod,
            date: date || new Date()
        }, { transaction: t });

        for (const item of items) {
            await TransactionItem.create({
                TransactionId: newTransaction.id,
                productName: item.name,
                quantity: item.quantity,
                price: item.price
            }, { transaction: t });

            // Update stock
            if (item.id) {
                const product = await Product.findByPk(item.id);
                if (product) {
                    product.stock -= item.quantity;
                    await product.save({ transaction: t });
                }
            }
        }

        await t.commit();

        // Return full transaction with items
        const completeTransaction = await Transaction.findByPk(newTransaction.id, {
            include: [{ model: TransactionItem, as: 'items' }]
        });

        res.json(completeTransaction);

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
});

// Routes - CLOSURES
app.get('/api/closures', async (req, res) => {
    try {
        const closures = await Closure.findAll({ order: [['date', 'DESC']] });
        res.json(closures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/closures', async (req, res) => {
    try {
        const { date, systemTotal, systemCash, systemCard, systemTransfer, countedCash, difference } = req.body;

        // Use findOrCreate or upsert to avoid duplicate dates
        const [closure, created] = await Closure.findOrCreate({
            where: { date },
            defaults: { systemTotal, systemCash, systemCard, systemTransfer, countedCash, difference }
        });

        if (!created) {
            // Update if already exists
            await closure.update({ systemTotal, systemCash, systemCard, systemTransfer, countedCash, difference });
        }

        res.json(closure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize DB and Start Server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    // Seed if empty
    Product.count().then(count => {
        if (count === 0) {
            Product.bulkCreate([
                { barcode: '7801610001353', name: 'Coca Cola 2L', price: 2500, stock: 50, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
                { barcode: '7802800533456', name: 'Papas Lays 140g', price: 1800, stock: 30, category: 'Snacks', image: 'https://images.unsplash.com/photo-1566478431370-7634f4948a21?auto=format&fit=crop&q=80&w=200' },
                { barcode: '7801620005432', name: 'Agua Mineral 1.5L', price: 1200, stock: 45, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=200' },
                { barcode: '7804500123987', name: 'Arroz Grado 2', price: 1100, stock: 100, category: 'Abarrotes', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
                { barcode: '7809900887123', name: 'Aceite Maravilla 1L', price: 2100, stock: 20, category: 'Abarrotes', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' }
            ]);
            console.log('Seed data created');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
