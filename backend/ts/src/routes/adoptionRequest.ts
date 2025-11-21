import express from 'express'
import AdoptionRequest from '../models/AdoptionRequest.js'

const router = express.Router()

// Get all adoption requests
router.get('/', async (req, res) => {
    try {
        const requests = await AdoptionRequest.find().sort({ submittedAt: -1 })
        res.json(requests)
    } catch (err) {
        res.status(500).json({ message: 'Error fetching adoption requests' })
    }
})

// Create new adoption request
router.post('/', async (req, res) => {
    try {
        const newRequest = new AdoptionRequest(req.body)
        const saved = await newRequest.save()
        res.status(201).json(saved)
    } catch (err) {
        res.status(400).json({ message: 'Error saving adoption request' })
    }
})

// Update adoption request status
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body
        const updated = await AdoptionRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ message: 'Adoption request not found' })
        }
        res.json(updated)
    } catch (err) {
        res.status(400).json({ message: 'Error updating adoption request' })
    }
})

// Delete adoption request
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await AdoptionRequest.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ message: 'Adoption request not found' })
        }
        res.json({ message: 'Adoption request deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Error deleting adoption request' })
    }
})

export default router
