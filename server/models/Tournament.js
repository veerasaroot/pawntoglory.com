import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  featuredImage: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: [true, 'Tournament date is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  format: {
    type: String,
    required: [true, 'Format is required'],
    enum: ['Swiss', 'Round Robin', 'Knockout', 'Blitz', 'Rapid', 'Classical'],
  },
  prize: {
    type: String,
    default: '',
  },
  organizer: {
    type: String,
    default: '',
  },
  participants: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

const generateSlug = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0E00-\u0E7F-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

tournamentSchema.pre('save', function (next) {
  if (this.isModified('slug') && this.slug) {
    this.slug = generateSlug(this.slug);
  } else if (!this.slug && (this.isModified('title') || this.isNew)) {
    this.slug = generateSlug(this.title);
  }
  if (this.status === 'upcoming' && this.date <= new Date()) {
    this.status = 'ongoing';
  }
  next();
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
export default Tournament;
