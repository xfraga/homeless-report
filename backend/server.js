// Homeless Report System - Backend Server
// A simple Express.js API server with in-memory data storage

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory data storage (replace with a database in production)
let reports = [];
let reportIdCounter = 1;

// API Routes


/**
 * GET /api
 * Base API endpoint
 */
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Homeless Report API v1.0',
        endpoints: {
            health: '/api/health',
            reports: '/api/reports',
            reportById: '/api/reports/:id',
            stats: '/api/stats'
        }
    });
});
/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        totalReports: reports.length 
    });
});

/**
 * GET /api/reports
 * Get all reports, optionally filtered
 */
app.get('/api/reports', (req, res) => {
    try {
        const { urgency, status, limit } = req.query;
        
        let filteredReports = [...reports];
        
        // Filter by urgency if provided
        if (urgency) {
            filteredReports = filteredReports.filter(r => r.urgency === urgency);
        }
        
        // Filter by status if provided
        if (status) {
            filteredReports = filteredReports.filter(r => r.status === status);
        }
        
        // Sort by timestamp (newest first)
        filteredReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Limit results if specified
        if (limit) {
            filteredReports = filteredReports.slice(0, parseInt(limit));
        }
        
        res.json({
            success: true,
            count: filteredReports.length,
            data: filteredReports
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch reports',
            message: error.message 
        });
    }
});

/**
 * GET /api/reports/:id
 * Get a specific report by ID
 */
app.get('/api/reports/:id', (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            return res.status(404).json({ 
                success: false, 
                error: 'Report not found' 
            });
        }
        
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch report',
            message: error.message 
        });
    }
});


/**
 * GET /api/reports
 * Get all reports
 */
app.get('/api/reports', (req, res) => {
    try {
        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reports',
            message: error.message
        });
    }
});
/**
 * POST /api/reports
 * Create a new report
 */
app.post('/api/reports', (req, res) => {
    try {
        const { 
            location, 
            latitude, 
            longitude, 
            status, 
            urgency, 
            description,
            reporterName,
            reporterContact 
        } = req.body;
        
        // Validation
        if (!location || !status || !urgency) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: location, status, urgency' 
            });
        }
        
        // Create new report
        const newReport = {
            id: reportIdCounter++,
            location,
            latitude: latitude || null,
            longitude: longitude || null,
            status,
            urgency,
            description: description || '',
            reporterName: reporterName || 'Anonymous',
            reporterContact: reporterContact || 'Not provided',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        reports.push(newReport);
        
        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: newReport
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create report',
            message: error.message 
        });
    }
});

/**
 * PUT /api/reports/:id
 * Update an existing report
 */
app.put('/api/reports/:id', (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        const reportIndex = reports.findIndex(r => r.id === reportId);
        
        if (reportIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Report not found' 
            });
        }
        
        // Update report
        reports[reportIndex] = {
            ...reports[reportIndex],
            ...req.body,
            id: reportId, // Preserve ID
            createdAt: reports[reportIndex].createdAt, // Preserve creation date
            updatedAt: new Date().toISOString()
        };
        
        res.json({
            success: true,
            message: 'Report updated successfully',
            data: reports[reportIndex]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update report',
            message: error.message 
        });
    }
});

/**
 * DELETE /api/reports/:id
 * Delete a report
 */
app.delete('/api/reports/:id', (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        const reportIndex = reports.findIndex(r => r.id === reportId);
        
        if (reportIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Report not found' 
            });
        }
        
        reports.splice(reportIndex, 1);
        
        res.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete report',
            message: error.message 
        });
    }
});

/**
 * GET /api/stats
 * Get statistics about reports
 */
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            total: reports.length,
            byUrgency: {
                high: reports.filter(r => r.urgency === 'high').length,
                medium: reports.filter(r => r.urgency === 'medium').length,
                low: reports.filter(r => r.urgency === 'low').length
            },
            byStatus: {
                healthy: reports.filter(r => r.status === 'healthy').length,
                minor_concern: reports.filter(r => r.status === 'minor_concern').length,
                urgent: reports.filter(r => r.status === 'urgent').length,
                unknown: reports.filter(r => r.status === 'unknown').length
            },
            recentReports: reports.slice(-5).reverse()
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch stats',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Route not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Homeless Report System - Backend Server`);
    console.log(`===========================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`===========================================`);
});

module.exports = app;