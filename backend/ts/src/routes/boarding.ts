import express from 'express'
import dummyBoardings from '../data/dummyBoarding.js'

const router = express.Router()

// Get all boardings
router.get('/', async (req, res) => {
    try {
        // Return dummy data with IDs
        const boardingsWithIds = dummyBoardings.map((boarding, index) => ({
            ...boarding,
            _id: `dummy-${index + 1}`,
        }))
        res.json(boardingsWithIds)
    } catch (err) {
        res.status(500).json({ message: 'Error fetching boardings' })
    }
})

// Get boardings near a location (sorted by distance)
router.get('/nearby', async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10000 } = req.query

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: 'Latitude and longitude are required',
            })
        }

        const lat = parseFloat(latitude as string)
        const lng = parseFloat(longitude as string)
        const maxDist = parseInt(maxDistance as string)

        // Calculate distances manually for dummy data
        const boardingsWithDistance = dummyBoardings.map((boarding, index) => {
            // Default to 0,0 if coordinates are missing (shouldn't happen with valid data)
            const [boardingLng, boardingLat] = boarding.location?.coordinates || [0, 0]

            // Haversine formula for distance calculation
            const R = 6371e3 // Earth's radius in meters
            const φ1 = (lat * Math.PI) / 180
            const φ2 = (boardingLat * Math.PI) / 180
            const Δφ = ((boardingLat - lat) * Math.PI) / 180
            const Δλ = ((boardingLng - lng) * Math.PI) / 180

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = R * c // Distance in meters

            return {
                ...boarding,
                _id: `dummy-${index + 1}`,
                distance,
                distanceInKm: Math.round((distance / 1000) * 100) / 100,
            }
        })

        // Filter by max distance and sort
        const nearbyBoardings = boardingsWithDistance
            .filter(boarding => boarding.distance <= maxDist)
            .sort((a, b) => a.distance - b.distance)

        res.json(nearbyBoardings)
    } catch (err) {
        console.error('Error finding nearby boardings:', err)
        res.status(500).json({
            message: 'Error finding nearby boardings',
            error: err instanceof Error ? err.message : 'Unknown error',
        })
    }
})

// Get boarding by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        // Since we only have dummy data, we look for the ID format "dummy-X"
        if (id.startsWith('dummy-')) {
            const parts = id.split('-')
            const indexStr = parts[1]
            if (!indexStr) {
                return res.status(404).json({ message: 'Invalid ID format' })
            }
            const index = parseInt(indexStr) - 1
            if (index >= 0 && index < dummyBoardings.length) {
                const boarding = {
                    ...dummyBoardings[index],
                    _id: id
                }
                return res.json(boarding)
            }
        }

        return res.status(404).json({ message: 'Boarding not found' })
    } catch (err) {
        res.status(500).json({ message: 'Error fetching boarding details' })
    }
})

export default router
