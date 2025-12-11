import mongoose from 'mongoose';


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

const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\u0E00-\u0E7F-]+/g, '') // Remove all non-word chars (except Thai and -)
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// Generate slug before saving
articleSchema.pre('save', function (next) {
    if (this.isModified('slug') && this.slug) {
        this.slug = generateSlug(this.slug);
    } else if (!this.slug && (this.isModified('title') || this.isNew)) {
        this.slug = generateSlug(this.title);
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
