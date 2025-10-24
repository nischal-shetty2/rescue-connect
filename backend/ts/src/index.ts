import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import connectDB from './config/database.js'
import adoptionRoutes from './routes/adoption.js'
import { DiagnosisService } from './proxy/index.js'

// Connect to MongoDB
connectDB()

const PORT = process.env.PORT || 3000
const app = express()
const diagnosisService = new DiagnosisService()

// Middleware
app.use(cors())
app.use(express.json())

// to parse file uploads
const upload = multer({ storage: multer.memoryStorage() })

// 🧠 AI Diagnosis route
app.post('/diagnose', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' })

    const { animalType, symptoms } = req.body
    if (!animalType)
      return res.status(400).json({ error: 'animalType required' })

    console.log(
      `Processing diagnosis request for ${animalType} with symptoms:`,
      symptoms
    )

    // Use the diagnosis service
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

app.get('/', (_, res) => {
  res.send('Server is running!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
