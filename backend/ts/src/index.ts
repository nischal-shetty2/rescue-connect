import 'dotenv/config'
import express from 'express'
import multer from 'multer'

import { DiagnosisService } from './ai/index.ts'

const PORT = 3000
const app = express()
const diagnosisService = new DiagnosisService()

// Enable CORS for frontend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// to parse non-file fields
app.use(express.json())

// to parse file uploads
const upload = multer({ storage: multer.memoryStorage() })

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

app.get('/', (_, res) => {
  res.send('Server is running!')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
