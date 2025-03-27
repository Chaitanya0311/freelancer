const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const db = require('../config/database');

// Get all tables
router.get('/', async (req, res) => {
    try {
        // Set cache control headers
        res.set('Cache-Control', 'no-store');
        const [tables] = await db.query('SELECT * FROM tables ORDER BY table_number');
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Error fetching tables', error: error.message });
    }
});

// Reset all tables to available
router.post('/reset', tableController.resetTables);

// Get a single table
router.get('/:id', async (req, res) => {
    try {
        // Set cache control headers
        res.set('Cache-Control', 'no-store');
        const [rows] = await db.query('SELECT * FROM tables WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).json({ message: 'Error fetching table' });
    }
});

// Update table status
router.patch('/:id/status', async (req, res) => {
    try {
        // Set cache control headers
        res.set('Cache-Control', 'no-store');
        const { status } = req.body;
        const [result] = await db.query(
            'UPDATE tables SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Table not found' });
        }
        res.json({ message: 'Table status updated successfully' });
    } catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({ message: 'Error updating table status', error: error.message });
    }
});

// Create a new table
router.post('/', tableController.createTable);

// Update a table
router.put('/:id', tableController.updateTable);

// Delete a table
router.delete('/:id', tableController.deleteTable);

module.exports = router; 