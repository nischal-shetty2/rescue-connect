import express from 'express'
import Vet, { IVet } from '../models/Vet.js'
import dummyVets from '../data/dummyVets.js'

const router = express.Router()

// Initialize database with dummy data (call this once)
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Vet.deleteMany({})

    // Insert dummy data
    const vets = await Vet.insertMany(dummyVets)

    res.status(201).json({
      message: 'Database seeded successfully',
      count: vets.length,
      vets,
    })
  } catch (err) {
    console.error('Error seeding database:', err)
    res.status(500).json({
      message: 'Error seeding database',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

// Get all vets
router.get('/', async (req, res) => {
  try {
    // Try to fetch from database, fallback to dummy data if DB is not available
    try {
      const vets = await Vet.find()
      if (vets.length > 0) {
        return res.json(vets)
      }
    } catch (dbError) {
      console.log('Database not available, using dummy data')
    }

    // Return dummy data with IDs
    const vetsWithIds = dummyVets.map((vet, index) => ({
      ...vet,
      _id: `dummy-${index + 1}`,
    }))
    res.json(vetsWithIds)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vets' })
  }
})

// Get vets near a location (sorted by distance)
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

    // Try database query first
    try {
      const vets = await Vet.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            distanceField: 'distance',
            maxDistance: maxDist, // in meters
            spherical: true,
          },
        },
        {
          $addFields: {
            distanceInKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
          },
        },
        {
          $sort: { distance: 1 },
        },
      ])

      if (vets.length > 0) {
        return res.json(vets)
      }
    } catch (dbError) {
      console.log(
        'Database not available, using dummy data with manual distance calculation'
      )
    }

    // Fallback: Calculate distances manually for dummy data
    const vetsWithDistance = dummyVets.map((vet, index) => {
      const [vetLng, vetLat] = vet.location!.coordinates

      // Haversine formula for distance calculation
      const R = 6371e3 // Earth's radius in meters
      const φ1 = (lat * Math.PI) / 180
      const φ2 = (vetLat * Math.PI) / 180
      const Δφ = ((vetLat - lat) * Math.PI) / 180
      const Δλ = ((vetLng - lng) * Math.PI) / 180

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distance in meters

      return {
        ...vet,
        _id: `dummy-${index + 1}`,
        distance,
        distanceInKm: Math.round((distance / 1000) * 100) / 100,
      }
    })

    // Filter by max distance and sort
    const nearbyVets = vetsWithDistance
      .filter(vet => vet.distance <= maxDist)
      .sort((a, b) => a.distance - b.distance)

    res.json(nearbyVets)
  } catch (err) {
    console.error('Error finding nearby vets:', err)
    res.status(500).json({
      message: 'Error finding nearby vets',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

// Get vet by ID
router.get('/:id', async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id)
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' })
    }
    res.json(vet)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vet details' })
  }
})

// Create new vet (admin only - add auth middleware in production)
router.post('/', async (req, res) => {
  try {
    const newVet = new Vet(req.body)
    const saved = await newVet.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({
      message: 'Error creating vet',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

/*
 * 🌍 To use REAL data from Google Places API (free tier available):
 *
 * 1. Get API key from: https://console.cloud.google.com/
 * 2. Enable Places API
 * 3. Install: npm install @googlemaps/google-maps-services-js
 * 4. Add to .env: GOOGLE_MAPS_API_KEY=your_key_here
 *
 * Example implementation:
 *
 * import { Client } from '@googlemaps/google-maps-services-js'
 * const client = new Client({})
 *
 * router.get('/nearby-real', async (req, res) => {
 *   const { latitude, longitude } = req.query
 *   const response = await client.placesNearby({
 *     params: {
 *       location: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
 *       radius: 5000,
 *       type: 'veterinary_care',
 *       key: process.env.GOOGLE_MAPS_API_KEY!,
 *     },
 *   })
 *   res.json(response.data.results)
 * })
 */

export default router
