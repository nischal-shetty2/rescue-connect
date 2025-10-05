import express from 'express'
import multer from 'multer'
import { Groq } from 'groq-sdk'
import { z } from 'zod'
import FormData from 'form-data'
import fetch from 'node-fetch'

const PORT = 3000
const FLASK_SERVER_URL = 'http://localhost:5001'
const app = express()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

// Type for Flask server response
interface FlaskResult {
  disease?: string
  confidence?: number
  severity?: string
  description?: string
  symptoms?: string[]
  treatment?: string
  urgency?: string
  analysisTime?: string
  allProbabilities?: Record<string, number>
}

// zod schema for structured response
const DiagnosisSchema = z.object({
  disease: z.string(),
  confidence: z.number(),
  severity: z.string(),
  description: z.string(),
  symptoms: z.array(z.string()),
  treatment: z.object({
    medication: z.string(),
    dosage: z.string(),
    topical: z.string(),
    additional: z.array(z.string()),
  }),
  urgency: z.string(),
  allProbabilities: z.record(z.string(), z.number()),
})
type Diagnosis = z.infer<typeof DiagnosisSchema>

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

    const startTime = Date.now()

    // Step 1: Optional CNN model call (mainly for validation/logging)
    let cnnResult: FlaskResult | null = null
    try {
      console.log('Calling CNN model for reference...')
      const formData = new FormData()
      formData.append('image', req.file.buffer, {
        filename: 'image.jpg',
        contentType: req.file.mimetype || 'image/jpeg',
      })
      formData.append('animalType', animalType)
      formData.append('symptoms', JSON.stringify(symptoms || []))

      const flaskResponse = await fetch(`${FLASK_SERVER_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      })

      if (flaskResponse.ok) {
        cnnResult = (await flaskResponse.json()) as FlaskResult
        console.log('CNN model reference result:', cnnResult)
      } else {
        console.log('CNN model unavailable, proceeding with Groq-only analysis')
      }
    } catch (cnnError) {
      console.log('CNN model error (proceeding without it):', cnnError)
    }

    // Step 2: Primary diagnosis using Groq Vision
    const imageBase64 = req.file.buffer.toString('base64')
    const mimeType = req.file.mimetype || 'image/jpeg'
    const imageUrl = `data:${mimeType};base64,${imageBase64}`

    console.log('Performing primary diagnosis with Groq Vision...')
    const groqResponse = await groq.chat.completions.create({
      model: 'llama-3.2-90b-vision-preview',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a highly skilled veterinary diagnostic specialist with expertise in analyzing animal skin conditions and diseases across dogs, cats, and cattle. Analyze the provided image to perform a comprehensive veterinary diagnosis.

${cnnResult ? `Note: A basic CNN model detected "${cnnResult.disease}" with ${cnnResult.confidence}% confidence, but this model has limited training data (only 75 dog images with basic classes: bacterial, fungal, healthy). Your analysis should be the primary diagnostic assessment.` : 'Perform your analysis independently as the primary diagnostic tool.'}

Return ONLY valid JSON matching this exact schema:
{
  "disease": "string - specific disease name (e.g., 'Bacterial Pyoderma', 'Dermatophytosis', 'Contact Dermatitis')",
  "confidence": "number - your confidence score between 0 and 100",
  "severity": "string - mild, moderate, or severe",
  "description": "string - detailed description of the diagnosed condition and its characteristics",
  "symptoms": ["string"] - comprehensive list of symptoms visible or associated with this condition",
  "treatment": {
    "medication": "string - specific recommended medications",
    "dosage": "string - detailed dosage instructions",
    "topical": "string - topical treatments if applicable",
    "additional": ["string"] - additional care instructions and recommendations
  },
  "urgency": "string - detailed urgency assessment and recommended timeline for treatment",
  "allProbabilities": {"string": "number"} - differential diagnosis with probabilities for other possible conditions
}

Focus on:
- Specific disease identification (not just broad categories)
- Breed-specific considerations if applicable
- Environmental factors that might contribute
- Detailed treatment protocols
- Clear urgency assessment`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please analyze this ${animalType} for skin diseases or health conditions.

Animal type: ${animalType}
Reported symptoms: ${symptoms && symptoms.length > 0 ? (Array.isArray(symptoms) ? symptoms.join(', ') : symptoms) : 'None specified'}
${cnnResult ? `CNN reference (limited model): ${cnnResult.disease} (${cnnResult.confidence}% confidence)` : 'No CNN reference available'}

Provide a comprehensive veterinary diagnosis based on your visual analysis of the image.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    })

    const groqRaw = groqResponse.choices?.[0]?.message?.content
    if (!groqRaw) throw new Error('Empty response from Groq')

    try {
      const groqResult = DiagnosisSchema.parse(JSON.parse(groqRaw))

      const analysisTime = new Date().toLocaleTimeString()
      const processingTime = Date.now() - startTime

      const finalResult = {
        ...groqResult,
        analysisTime,
        processingTimeMs: processingTime,
        modelUsed: cnnResult
          ? 'Groq Vision (with CNN reference)'
          : 'Groq Vision (standalone)',
        cnnReference: cnnResult
          ? {
              disease: cnnResult.disease,
              confidence: cnnResult.confidence,
              note: 'Limited CNN model used only for reference',
            }
          : null,
      }

      console.log('Primary Groq diagnosis completed:', finalResult)
      res.json(finalResult)
    } catch (parseError) {
      console.error('Groq response parsing error:', parseError)
      console.error('Raw Groq response:', groqRaw)

      // Fallback response if parsing fails
      res.status(500).json({
        error: 'Diagnosis parsing failed',
        details: 'The AI model returned an invalid response format',
        rawResponse: groqRaw.substring(0, 500) + '...',
      })
    }
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
