import express from 'express'
import Adoption from '../models/Adoption.ts'

const router = express.Router()

// Get all adoption posts
router.get('/', async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ postedAt: -1 })
    res.json(adoptions)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching adoptions' })
  }
})

// Create new adoption post
router.post('/', async (req, res) => {
  try {
    const newAdoption = new Adoption(req.body)
    const saved = await newAdoption.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'Error saving adoption post' })
  }
})

export default router
