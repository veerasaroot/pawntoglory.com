import express from 'express';
import Category from '../models/Category.js';
import Article from '../models/Article.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort('name');

        // Get article count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const count = await Article.countDocuments({ category: cat._id, status: 'published' });
                return { ...cat.toObject(), articleCount: count };
            })
        );

        res.json(categoriesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/categories
// @desc    Create category
// @access  Private (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, slug, description, image } = req.body;
        const category = await Category.create({ name, slug, description, image });
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, slug, description, image } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, slug, description, image },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
