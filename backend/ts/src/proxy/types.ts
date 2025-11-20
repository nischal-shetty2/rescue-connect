import { z } from 'zod'

// Type for Flask server response
export interface FlaskResult {
  disease?: string
  confidence?: number
  severity?: string
  description?: string
  symptoms?: string[]
  treatment?: string
  urgency?: string
  analysisTime?: string
  allProbabilities?: {
    Healthy: number
    Bacterial: number
    Fungal: number
    Other?: number
  }
}

// Zod schema for structured response validation
export const DiagnosisSchema = z.object({
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
  detectedAnimal: z.enum(['dog', 'cat', 'cow', 'other']).optional(),
  allProbabilities: z.object({
    Healthy: z.number(),
    Bacterial: z.number(),
    Fungal: z.number(),
    Other: z.number().optional(),
  }),
})

export type Diagnosis = z.infer<typeof DiagnosisSchema>

// Input types for diagnosis
export interface DiagnosisInput {
  imageBuffer: Buffer
  mimeType: string
  animalType?: string
  symptoms?: string[] | string
}

// Final result type returned to client
export interface DiagnosisResult extends Diagnosis {
  analysisTime: string
  processingTimeMs: number
  modelUsed: string
  cnnReference?: {
    disease?: string
    confidence?: number
    note: string
  } | null
}
