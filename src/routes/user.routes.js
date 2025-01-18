const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const {
            full_name,
            email,
            dealership_name,
            phone,
            dealer_id,
            userType
        } = req.body;

        // Validate required fields
        if (!email || !full_name) {
            return res.status(400).json({
                success: false,
                message: 'Email and full name are required'
            });
        }

        // Check if dealer exists
        const [existingDealers] = await db.query(
            'SELECT * FROM dealer_info WHERE email = ?',
            [email]
        );

        if (existingDealers.length === 0) {
            // Create new dealer if doesn't exist
            const [result] = await db.query(
                `INSERT INTO dealer_info (email, full_name, dealership_name, phone, dealer_id, user_type) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [email, full_name, dealership_name, phone, dealer_id, userType]
            );

            const [newDealer] = await db.query(
                'SELECT * FROM dealer_info WHERE id = ?',
                [result.insertId]
            );

            return res.json({
                success: true,
                message: 'Dealer profile created successfully',
                user: newDealer[0]
            });
        }

        // Update existing dealer
        await db.query(
            `UPDATE dealer_info 
             SET full_name = ?, 
                 dealership_name = ?, 
                 phone = ?, 
                 dealer_id = ?, 
                 user_type = ?
             WHERE email = ?`,
            [full_name, dealership_name, phone, dealer_id, userType, email]
        );

        const [updatedDealer] = await db.query(
            'SELECT * FROM dealer_info WHERE email = ?',
            [email]
        );

        res.json({
            success: true,
            message: 'Dealer profile updated successfully',
            user: updatedDealer[0]
        });

    } catch (error) {
        console.error('Error updating dealer profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating dealer profile',
            error: error.message
        });
    }
});

// Get dealer info by email
router.get('/dealer/:email', async (req, res) => {
    try {
        const email = req.params.email;
        
        const [dealer] = await db.query(
            'SELECT * FROM dealer_info WHERE email = ?',
            [email]
        );

        if (dealer.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Dealer not found'
            });
        }

        res.json({
            success: true,
            dealer: dealer[0]
        });

    } catch (error) {
        console.error('Error fetching dealer info:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dealer info',
            error: error.message
        });
    }
});

module.exports = router; 
