const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, t.table_number
            FROM orders o
            JOIN tables t ON o.table_id = t.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get a single order
router.get('/:id', async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(orders[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const { table_id, items, total_amount } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // Create the order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (table_id, total_amount, status) VALUES (?, ?, ?)',
            [table_id, total_amount, 'pending']
        );
        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        // Update table status
        await connection.query(
            'UPDATE tables SET status = ? WHERE id = ?',
            ['occupied', table_id]
        );

        await connection.commit();
        
        res.status(201).json({ 
            id: orderId,
            message: 'Order created successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    } finally {
        connection.release();
    }
});

// Get orders by table
router.get('/table/:tableId', async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE table_id = ? ORDER BY created_at DESC',
            [req.params.tableId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});

// Generate bill for an order
router.get('/:id/bill', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Get order details
        const [orders] = await db.query(`
            SELECT o.*, t.table_number
            FROM orders o
            JOIN tables t ON o.table_id = t.id
            WHERE o.id = ?
        `, [orderId]);
        
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        // Get order items with dish details
        const [items] = await db.query(`
            SELECT oi.*, d.name as dish_name
            FROM order_items oi
            JOIN dishes d ON oi.dish_id = d.id
            WHERE oi.order_id = ?
        `, [orderId]);

        // Calculate tax (10%)
        const taxRate = 0.10;
        const subtotal = order.total_amount;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Format the bill
        const bill = {
            orderId: order.id,
            tableNumber: order.table_number,
            date: order.created_at,
            items: items.map(item => ({
                name: item.dish_name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price
            })),
            subtotal: subtotal,
            tax: tax,
            total: total
        };

        res.json(bill);
    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ error: 'Error generating bill' });
    }
});

module.exports = router; 