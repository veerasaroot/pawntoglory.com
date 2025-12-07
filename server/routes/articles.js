import express from 'express';
import Article from '../models/Article.js';
import { protect, editor } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all published articles (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10, sort } = req.query;
        const query = { status: 'published' };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }

        let sortQuery = { publishedAt: -1 };
        if (sort === '-views') {
            sortQuery = { views: -1 };
        }

        const articles = await Article.find(query)
            .populate('author', 'name avatar')
            .populate('category', 'name slug')
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Article.countDocuments(query);

        res.json({
            articles,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/articles/admin
// @desc    Get all articles (admin/editor)
// @access  Private
router.get('/admin', protect, editor, async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'name')
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/articles/:slug
// @desc    Get single article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
            .populate('author', 'name avatar bio')
            .populate('category', 'name slug');

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Increment views
        article.views += 1;
        await article.save();

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/articles
// @desc    Create article
// @access  Private (Editor/Admin)
router.post('/', protect, editor, async (req, res) => {
    try {
        const { title, content, excerpt, featuredImage, category, status, tags } = req.body;

        const article = await Article.create({
            title,
            content,
            excerpt,
            featuredImage,
            category,
            status,
            tags: tags ? tags.split(',').map((t) => t.trim()) : [],
            author: req.user._id,
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Private (Editor/Admin)
router.put('/:id', protect, editor, async (req, res) => {
    try {
        const { title, content, excerpt, featuredImage, category, status, tags } = req.body;

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        article.title = title || article.title;
        article.content = content || article.content;
        article.excerpt = excerpt || article.excerpt;
        article.featuredImage = featuredImage || article.featuredImage;
        article.category = category || article.category;
        article.status = status || article.status;
        article.tags = tags ? tags.split(',').map((t) => t.trim()) : article.tags;

        await article.save();
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/articles/:id
// @desc    Delete article
// @access  Private (Admin)
router.delete('/:id', protect, editor, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
