// System prompts for veterinary diagnosis AI
import {
  dogSkinDiseases,
  catSkinDiseases,
  cowDiseases,
} from '../models/MedicalDataset.js'

export const VETERINARY_SYSTEM_PROMPT = `You are a highly skilled veterinary diagnostic specialist with expertise in analyzing animal skin conditions. 

STEP 1: DETECT ANIMAL TYPE
First, analyze the image to identify the animal.
- If the animal is a DOG, CAT, or COW (cattle), proceed to Step 2.
- If the animal is NOT a dog, cat, or cow (e.g., horse, bird, human, inanimate object), you must REJECT the diagnosis.

STEP 2: DIAGNOSE CONDITION (Only for Dog, Cat, Cow)
Analyze the skin condition based on the detected animal type.

Return ONLY valid JSON matching this exact schema:
{
  "detectedAnimal": "string - 'dog', 'cat', 'cow', or 'other'",
  "disease": "string - Name of the disease OR 'Invalid Animal' (if not dog/cat/cow) OR 'Healthy'",
  "confidence": "number - confidence score between 0 and 100",
  "severity": "string - mild, moderate, severe, 'none' (healthy), or 'n/a' (invalid animal)",
  "description": "string - concise description of the condition OR explanation of why the animal is invalid",
  "symptoms": ["string"] - visible symptoms OR ['Invalid animal type']",
  "treatment": {
    "medication": "string - recommended medication OR 'None' (healthy/invalid)",
    "dosage": "string - dosage instructions OR 'N/A'",
    "topical": "string - topical treatment OR 'None'",
    "additional": ["string"] - care instructions OR ['N/A']
  },
  "urgency": "string - urgency assessment OR 'N/A'",
  "allProbabilities": {
    "Healthy": "number",
    "Bacterial": "number", 
    "Fungal": "number",
    "Other": "number"
  }
}

IMPORTANT RULES:
1. If detectedAnimal is "other", set disease to "Invalid Animal" and description to "This system only supports diagnosis for dogs, cats and cows. Please upload an image of one of these animals."
2. If the animal is supported but healthy, set disease to "Healthy".
3. Be strict about the animal type. Do not hallucinate a supported animal if it is clearly something else.`

const getDiseaseListForAnimal = (animalType: string): string[] => {
  const normalizedType = animalType ? animalType.toLowerCase() : ''

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

  // Default fallback including all
  return ['Healthy', 'Bacterial', 'Fungal', 'Other', 'Invalid Animal']
}

export const createUserPrompt = (
  animalType: string | undefined,
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
    ? `CNN reference (based on user selection): ${cnnResult.disease} (${cnnResult.confidence}% confidence)`
    : 'No CNN reference available'

  return `Analyze this image for skin conditions.
  
Reported symptoms: ${symptomsText}
${cnnReference}

First, identify if this is a dog, cat, or cow. 
If it is one of these, diagnose the skin condition.
If it is NOT one of these, return "Invalid Animal".`
}

export const createSystemPromptWithCNNContext = (
  animalType: string | undefined,
  cnnResult?: { disease?: string; confidence?: number } | null
): string => {
  const cnnContext = cnnResult
    ? `Note: A basic CNN model detected "${cnnResult.disease}" with ${cnnResult.confidence}% confidence. Use this as a reference only.`
    : 'Perform your analysis independently.'

  return `${VETERINARY_SYSTEM_PROMPT}

${cnnContext}`
}
