import express from 'express';
import Article from '../models/Article.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        // Parallel execution for performance
        const [
            articleCount,
            viewCountResult,
            userCount,
            recentArticles,
            recentUsers
        ] = await Promise.all([
            Article.countDocuments(),
            Article.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]),
            User.countDocuments(),
            Article.find().sort({ createdAt: -1 }).limit(5).select('title createdAt status author'),
            User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt role')
        ]);

        const totalViews = viewCountResult.length > 0 ? viewCountResult[0].totalViews : 0;

        // Format recent activity
        const activity = [
            ...recentArticles.map(a => ({
                id: a._id,
                type: 'article',
                action: 'New article',
                title: a.title,
                time: a.createdAt,
                details: a.status
            })),
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'user',
                action: 'New user',
                title: u.email,
                time: u.createdAt,
                details: u.role
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

        res.json({
            totalArticles: articleCount,
            totalViews,
            totalUsers: userCount,
            recentActivity: activity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
