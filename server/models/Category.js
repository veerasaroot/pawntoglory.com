import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            set: (slug) => (slug ? slugify(slug, { lower: true, strict: true }) : slug),
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Generate slug before saving
categorySchema.pre('save', function (next) {
    if (!this.slug && (this.isModified('name') || this.isNew)) {
        this.slug = this.name;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
