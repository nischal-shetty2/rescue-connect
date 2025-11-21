import express from 'express'
import BreedingListing from '../models/BreedingListing.js'
import BreederComment from '../models/BreederComment.js'

const router = express.Router()

// --- Breeding Listings ---

// Get all breeding listings
router.get('/listings', async (req, res) => {
    try {
        const listings = await BreedingListing.find().sort({ postedAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: 'Error fetching breeding listings' })
    }
})

// Create a new breeding listing
router.post('/listings', async (req, res) => {
    try {
        const newListing = new BreedingListing(req.body)
        const savedListing = await newListing.save()
        res.status(201).json(savedListing)
    } catch (err) {
        res.status(400).json({ message: 'Error creating breeding listing', error: err })
    }
})

// --- Breeder Comments ---

// Get comments for a specific breeder
router.get('/comments/:breederId', async (req, res) => {
    try {
        const comments = await BreederComment.find({ breederId: req.params.breederId }).sort({ timestamp: -1 })
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments' })
    }
})

// Add a comment for a breeder
router.post('/comments', async (req, res) => {
    try {
        const newComment = new BreederComment(req.body)
        const savedComment = await newComment.save()
        res.status(201).json(savedComment)
    } catch (err) {
        res.status(400).json({ message: 'Error adding comment', error: err })
    }
})

export default router
