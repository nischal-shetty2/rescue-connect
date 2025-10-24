// System prompts for veterinary diagnosis AI
import {
  dogSkinDiseases,
  catSkinDiseases,
  cowDiseases,
} from '../models/MedicalDataset.js'

export const VETERINARY_SYSTEM_PROMPT = `You are a highly skilled veterinary diagnostic specialist with expertise in analyzing animal skin conditions across dogs, cats, and cattle. Analyze the provided image to perform a concise veterinary diagnosis.

Return ONLY valid JSON matching this exact schema:
{
  "disease": "string - singular or general disease name (e.g., 'Pyoderma', 'Dermatophytosis', 'Dermatitis') OR 'Healthy' if no disease is detected",
  "confidence": "number - confidence score between 0 and 100",
  "severity": "string - mild, moderate, severe, or 'none' if healthy",
  "description": "string - concise description of the condition (max 3 sentences) OR health status if healthy",
  "symptoms": ["string"] - brief list of visible symptoms OR ['No symptoms observed'] if healthy",
  "treatment": {
    "medication": "string - recommended medication OR 'None required' if healthy",
    "dosage": "string - brief dosage instructions OR 'Not applicable' if healthy",
    "topical": "string - topical treatment OR 'None needed' if healthy",
    "additional": ["string"] - concise care instructions OR ['Routine care'] if healthy
  },
  "urgency": "string - brief urgency assessment OR 'Routine care' if healthy",
  "allProbabilities": {
    "Healthy": "number",
    "Bacterial": "number", 
    "Fungal": "number",
    "Other": "number (optional)"
  } - differential diagnosis probabilities for main categories, MUST include all four categories
}

IMPORTANT: If the animal's skin appears healthy with no visible signs of disease, irritation, lesions, or abnormalities, diagnose as "Healthy". Do not assume a disease is present.

Focus on:
- Honest assessment - diagnose "Healthy" if no disease is visible
- Singular/general disease names (e.g., 'Pyoderma' instead of 'Bacterial Pyoderma with complications')
- Concise descriptions (max 3 sentences) and brief responses for all fields
- Breed-specific considerations if relevant
- Environmental factors if applicable
- Clear, concise treatment and urgency recommendations`

const getDiseaseListForAnimal = (animalType: string): string[] => {
  const normalizedType = animalType.toLowerCase()

  if (normalizedType.includes('dog')) {
    return ['Healthy', ...Object.keys(dogSkinDiseases)]
  } else if (normalizedType.includes('cat')) {
    return ['Healthy', ...Object.keys(catSkinDiseases)]
  } else if (
    normalizedType.includes('cow') ||
    normalizedType.includes('cattle')
  ) {
    return Object.keys(cowDiseases)
  }

  // Default fallback
  return ['Healthy', 'Bacterial', 'Fungal', 'Other']
}

export const createUserPrompt = (
  animalType: string,
  symptoms: string[] | string | undefined,
  cnnResult?: { disease?: string; confidence?: number } | null
): string => {
  const symptomsText =
    symptoms && symptoms.length > 0
      ? Array.isArray(symptoms)
        ? symptoms.join(', ')
        : symptoms
      : 'None specified'

  const cnnReference = cnnResult
    ? `CNN reference: ${cnnResult.disease} (${cnnResult.confidence}% confidence)`
    : 'No CNN reference available'

  const allowedDiseases = getDiseaseListForAnimal(animalType)
  const diseaseListText = allowedDiseases.join(', ')

  return `Analyze this ${animalType} for skin conditions.

Animal type: ${animalType}
Reported symptoms: ${symptomsText}
${cnnReference}

CRITICAL: You MUST select the disease name ONLY from this exact list: ${diseaseListText}

Do not create new disease names or variations. Choose the most appropriate disease from the list above that matches your diagnosis.

Provide a concise veterinary diagnosis based on your visual analysis of the image.`
}

export const createSystemPromptWithCNNContext = (
  animalType: string,
  cnnResult?: { disease?: string; confidence?: number } | null
): string => {
  const cnnContext = cnnResult
    ? `Note: A basic CNN model detected "${cnnResult.disease}" with ${cnnResult.confidence}% confidence, but this model has limited training data (75 dog images: bacterial, fungal, healthy). Your analysis is the primary diagnostic assessment.`
    : 'Perform your analysis independently as the primary diagnostic tool.'

  const allowedDiseases = getDiseaseListForAnimal(animalType)
  const diseaseListText = allowedDiseases.join(', ')

  return `${VETERINARY_SYSTEM_PROMPT}

STRICT REQUIREMENT: The "disease" field in your response MUST be one of these exact names: ${diseaseListText}

Do not use variations, abbreviations, or combine disease names. Select the single most appropriate disease name from the list above.

${cnnContext}`
}
