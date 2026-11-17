

const express = require('express');
const router = express.Router();

const dashboardService = require('../services/dashboard.service')
const authenticateToken = require('../meddilewares/auth.middleware')

// Get dashboard data
router.get( '/dashboard', authenticateToken,async (req, res) => {
        try {
            const { period = 'thisWeek' } = req.query;

            const allowedPeriods = [
                'today',
                'thisWeek',
                'thisMonth',
                'thisYear'
            ];

            if (!allowedPeriods.includes(period)) {
                return res.status(400).json({
                    message: 'Invalid dashboard period'
                });
            }

            const dashboardData = await dashboardService.getDashboardData(
                req.user,
                period
            );

            return res.status(200).json({
                success: true,
                data: dashboardData
            });

        } catch (error) {
            console.error('Dashboard route error:', error);

            return res.status(500).json({
                success: false,
                message: 'Failed to load dashboard data'
            });
        }
    }
);

module.exports = router;
