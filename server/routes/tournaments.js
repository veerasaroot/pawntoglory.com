import express from "express";
import Tournament from "../models/Tournament.js";
import { protect, editor } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/tournaments
// @desc    Get all tournaments (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sort } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    
    let sortQuery = { date: 1 };
    if (sort === 'date-desc') {
      sortQuery = { date: -1 };
    } else if (sort === 'title') {
      sortQuery = { title: 1 };
    }
    
    const tournaments = await Tournament.find(query)
      .populate('author', 'name')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Tournament.countDocuments(query);
    
    res.json({
      tournaments,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tournaments/admin
// @desc    Get all tournaments (admin/editor)
// @access  Private
router.get("/admin", protect, editor, async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tournaments/:slug
// @desc    Get single tournament by slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const tournament = await Tournament.findOne({ slug: req.params.slug })
      .populate('author', 'name');
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tournaments
// @desc    Create tournament
// @access  Private (Editor/Admin)
router.post("/", protect, editor, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      featuredImage,
      date,
      location,
      format,
      prize,
      organizer,
      participants,
      status,
      tags,
    } = req.body;
    
    const tournament = await Tournament.create({
      title,
      slug,
      description,
      featuredImage,
      date: new Date(date),
      location,
      format,
      prize,
      organizer,
      participants: participants || 0,
      status: status || 'upcoming',
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      author: req.user._id,
    });
    
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private (Editor/Admin)
router.put("/:id", protect, editor, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    const {
      title,
      slug,
      description,
      featuredImage,
      date,
      location,
      format,
      prize,
      organizer,
      participants,
      status,
      tags,
    } = req.body;
    
    tournament.title = title || tournament.title;
    tournament.slug = slug || tournament.slug;
    tournament.description = description || tournament.description;
    tournament.featuredImage = featuredImage || tournament.featuredImage;
    tournament.date = date ? new Date(date) : tournament.date;
    tournament.location = location || tournament.location;
    tournament.format = format || tournament.format;
    tournament.prize = prize || tournament.prize;
    tournament.organizer = organizer || tournament.organizer;
    tournament.participants = participants || tournament.participants;
    tournament.status = status || tournament.status;
    tournament.tags = tags ? tags.split(",").map((t) => t.trim()) : tournament.tags;
    
    await tournament.save();
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @access  Private (Admin)
router.delete("/:id", protect, editor, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
