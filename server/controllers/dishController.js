const db = require('../config/database');

const dishController = {
    // Get all dishes
    getAllDishes: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT m.*, c.name as category_name 
                FROM menu_items m 
                LEFT JOIN categories c ON m.category_id = c.id
            `);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            res.status(500).json({ message: 'Error fetching dishes' });
        }
    },

    // Get a single dish
    getDishById: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT m.*, c.name as category_name 
                FROM menu_items m 
                LEFT JOIN categories c ON m.category_id = c.id 
                WHERE m.id = ?
            `, [req.params.id]);
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Dish not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching dish:', error);
            res.status(500).json({ message: 'Error fetching dish' });
        }
    },

    // Create a new dish
    createDish: async (req, res) => {
        try {
            const { name, description, price, category_id, is_available } = req.body;
            const [result] = await db.execute(
                'INSERT INTO menu_items (name, description, price, category_id, is_available) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, category_id, is_available]
            );
            res.status(201).json({ 
                id: result.insertId, 
                name, 
                description, 
                price, 
                category_id, 
                is_available 
            });
        } catch (error) {
            console.error('Error creating dish:', error);
            res.status(500).json({ message: 'Error creating dish' });
        }
    },

    // Update a dish
    updateDish: async (req, res) => {
        try {
            const { name, description, price, category_id, is_available } = req.body;
            await db.execute(
                'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, is_available = ? WHERE id = ?',
                [name, description, price, category_id, is_available, req.params.id]
            );
            res.json({ message: 'Dish updated successfully' });
        } catch (error) {
            console.error('Error updating dish:', error);
            res.status(500).json({ message: 'Error updating dish' });
        }
    },

    // Delete a dish
    deleteDish: async (req, res) => {
        try {
            await db.execute('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
            res.json({ message: 'Dish deleted successfully' });
        } catch (error) {
            console.error('Error deleting dish:', error);
            res.status(500).json({ message: 'Error deleting dish' });
        }
    },

    // Toggle dish availability
    toggleAvailability: async (req, res) => {
        try {
            await db.execute(
                'UPDATE menu_items SET is_available = NOT is_available WHERE id = ?',
                [req.params.id]
            );
            res.json({ message: 'Dish availability updated successfully' });
        } catch (error) {
            console.error('Error toggling dish availability:', error);
            res.status(500).json({ message: 'Error toggling dish availability' });
        }
    }
};

module.exports = dishController; 