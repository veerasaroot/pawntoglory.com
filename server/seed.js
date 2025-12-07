import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Article from './models/Article.js';

// Load env vars
dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        bio: 'Chief Editor of Pawn to Glory'
    },
    {
        name: 'Editor User',
        email: 'editor@example.com',
        password: 'password123',
        role: 'editor',
        bio: 'Senior Chess Analyst'
    },
    {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        bio: 'Chess enthusiast'
    }
];

const categories = [
    { name: 'World News', slug: 'world-news', description: 'Global chess tournaments and championships' },
    { name: 'Strategy', slug: 'strategy', description: 'Openings, endgames, and tactical guides' },
    { name: 'Tournaments', slug: 'tournaments', description: 'Coverage of major chess events' },
    { name: 'Interviews', slug: 'interviews', description: 'Exclusive talks with grandmasters' }
];

const articles = [
    {
        title: 'Magnus Carlsen Wins Another Title',
        slug: 'magnus-carlsen-wins-another-title',
        excerpt: 'The world champion demonstrates his dominance once again in a thrilling finale.',
        content: '<p>Magnus Carlsen has done it again. In a stunning display of tactical brilliance, he secured the victory...</p><p>The final game was a masterclass in positional play.</p>',
        status: 'published',
        tags: ['magnus', 'champion', 'news'],
        views: 1250,
        categoryIndex: 0 // World News
    },
    {
        title: 'Top 10 Openings for Beginners',
        slug: 'top-10-openings-beginners',
        excerpt: 'Master these essential openings to improve your rating quickly.',
        content: '<p>Starting out in chess can be daunting. Here are the top 10 openings you should know...</p><ul><li>Italian Game</li><li>Ruy Lopez</li><li>Sicilian Defense</li></ul>',
        status: 'published',
        tags: ['strategy', 'learning', 'openings'],
        views: 890,
        categoryIndex: 1 // Strategy
    },
    {
        title: 'Candidates Tournament 2024 Preview',
        slug: 'candidates-tournament-2024-preview',
        excerpt: 'Who will challenge Ding Liren? We analyze the contenders.',
        content: '<p>The Candidates Tournament is just around the corner. Let\'s look at the favorites...</p>',
        status: 'draft',
        tags: ['candidates', 'fide', 'preview'],
        views: 0,
        categoryIndex: 2 // Tournaments
    }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Article.deleteMany({});
        console.log('Old data cleared');

        // Create Users
        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create Categories
        const createdCategories = await Category.create(categories);
        console.log(`Created ${createdCategories.length} categories`);

        // Create Articles (assign random users and specific categories)
        const articleDocs = articles.map(article => {
            const { categoryIndex, ...rest } = article;
            return {
                ...rest,
                author: createdUsers[0]._id, // Admin user
                category: createdCategories[categoryIndex]._id
            };
        });

        await Article.create(articleDocs);
        console.log(`Created ${articleDocs.length} articles`);

        console.log('Database seeded successfully completely!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
