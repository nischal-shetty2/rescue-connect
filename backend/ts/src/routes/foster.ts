import express from 'express'
import { Foster } from '../models/Foster.js'

const router = express.Router()

// Get all fosters
router.get('/', async (req, res) => {
    try {
        const fosters = await Foster.find().sort({ createdAt: -1 })
        res.json(fosters)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fosters', error })
    }
})

// Create a new foster profile
router.post('/', async (req, res) => {
    try {
        const foster = new Foster(req.body)
        await foster.save()
        res.status(201).json(foster)
    } catch (error) {
        res.status(400).json({ message: 'Error creating foster profile', error })
    }
})

export default router
