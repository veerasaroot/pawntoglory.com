import mongoose from 'mongoose';
import slugify from 'slugify';

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            default: '',
        },
        featuredImage: {
            type: String,
            default: '',
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        views: {
            type: Number,
            default: 0,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        publishedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Generate slug before saving
articleSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Auto-generate excerpt from content
articleSchema.pre('save', function (next) {
    if (this.isModified('content') && !this.excerpt) {
        const text = this.content.replace(/<[^>]*>/g, '');
        this.excerpt = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }
    next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
