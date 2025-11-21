import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import connectDB from './config/database.js'
import adoptionRoutes from './routes/adoption.js'
import adoptionRequestRoutes from './routes/adoptionRequest.js'
import { DiagnosisService } from './proxy/index.js'
import marketplaceRoutes from './routes/marketplace.js';
import donationRoutes from './routes/donations.js'
import vetRoutes from './routes/vet.js'
import boardingRoutes from './routes/boarding.js'
import fosterRoutes from './routes/foster.js'
import strayRoutes from './routes/stray.js'
import breedingRoutes from './routes/breedingRoutes.js'

connectDB()

const PORT = process.env.PORT || 3000
const app = express()
const diagnosisService = new DiagnosisService()

app.use(cors())
app.use(express.json())


const upload = multer({ storage: multer.memoryStorage() })

app.post('/diagnose', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' })

    const { animalType, symptoms } = req.body
    // animalType is optional now (auto-detected if missing)

    console.log(
      `Processing diagnosis request. Animal: ${animalType || 'Auto-detect'}, Symptoms:`,
      symptoms
    )

    const result = await diagnosisService.diagnose({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype || 'image/jpeg',
      animalType,
      symptoms,
    })

    res.json(result)
  } catch (err) {
    console.error('Error in diagnosis pipeline:', err)
    res.status(500).json({
      error: 'Diagnosis service unavailable',
      details: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

app.use('/api/adoptions', adoptionRoutes)
app.use('/api/adoption-requests', adoptionRequestRoutes)
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/vets', vetRoutes)
app.use('/api/boardings', boardingRoutes)
app.use('/api/fosters', fosterRoutes)
app.use('/api/strays', strayRoutes)
app.use('/api/breeding', breedingRoutes)

app.get('/', (_, res) => {
  res.send('Server is running!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
