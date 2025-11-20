import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import FormData from 'form-data'
import fetch from 'node-fetch'

import type { DiagnosisInput, DiagnosisResult, FlaskResult } from './types.js'
import { DiagnosisSchema } from './types.js'
import {
  createSystemPromptWithCNNContext,
  createUserPrompt,
} from './prompts.js'

const FLASK_SERVER_URL = 'http://localhost:5001'

export class DiagnosisService {
  constructor() {
    // Verify Google API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error(
        'GOOGLE_GENERATIVE_AI_API_KEY environment variable is required'
      )
    }
  }

  /**
   * Call the optional CNN model for reference
   */
  private async getCNNReference(
    input: DiagnosisInput
  ): Promise<FlaskResult | null> {
    try {
      console.log('Calling CNN model for reference...')
      const formData = new FormData()
      formData.append('image', input.imageBuffer, {
        filename: 'image.jpg',
        contentType: input.mimeType,
      })
      // Default to dog if not provided, as CNN requires it. 
      // In auto-detect mode, CNN might be less accurate if it depends heavily on this.
      formData.append('animalType', input.animalType || 'dog')
      formData.append('symptoms', JSON.stringify(input.symptoms || []))

      const flaskResponse = await fetch(`${FLASK_SERVER_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      })

      if (flaskResponse.ok) {
        const cnnResult = (await flaskResponse.json()) as FlaskResult
        console.log('CNN model reference result:', cnnResult)
        return cnnResult
      } else {
        console.log(
          'primary model unavailable, proceeding with secondary-only analysis'
        )
        return null
      }
    } catch (cnnError) {
      console.log('CNN model error (proceeding without it):', cnnError)
      return null
    }
  }

  private async performGeminiDiagnosis(
    input: DiagnosisInput,
    cnnResult: FlaskResult | null
  ): Promise<any> {
    console.log('Performing primary diagnosis with Vision...')

    const imageBase64 = input.imageBuffer.toString('base64')
    const imageUrl = `data:${input.mimeType};base64,${imageBase64}`

    const systemPrompt = createSystemPromptWithCNNContext(
      input.animalType,
      cnnResult
    )
    const userPrompt = createUserPrompt(
      input.animalType,
      input.symptoms,
      cnnResult
    )

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: DiagnosisSchema,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image',
              image: imageUrl,
            },
          ],
        },
      ],
    })

    return result.object
  }

  /**
   * Main diagnosis method
   */
  async diagnose(input: DiagnosisInput): Promise<DiagnosisResult> {
    const startTime = Date.now()

    try {
      // Step 1: Optional CNN model call (mainly for validation/logging)
      const cnnResult = await this.getCNNReference(input)

      // Step 2: Primary diagnosis using Secondary Vision
      const geminiResult = await this.performGeminiDiagnosis(input, cnnResult)

      const analysisTime = new Date().toLocaleTimeString()
      const processingTime = Date.now() - startTime

      const finalResult: DiagnosisResult = {
        ...geminiResult,
        analysisTime,
        processingTimeMs: processingTime,
        modelUsed: cnnResult
          ? 'Secondary Vision (with CNN reference)'
          : 'Secondary Vision (standalone)',
        cnnReference: cnnResult
          ? {
            disease: cnnResult.disease,
            confidence: cnnResult.confidence,
            note: 'Limited CNN model used only for reference',
          }
          : null,
      }

      console.log('Secondary diagnosis completed:', finalResult)
      return finalResult
    } catch (error) {
      console.error('Error in diagnosis pipeline:', error)
      throw new Error(
        `Diagnosis service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
