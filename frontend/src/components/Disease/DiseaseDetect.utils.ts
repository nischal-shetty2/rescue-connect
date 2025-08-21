import type {
  AnimalId,
  AnimalType,
  DiseaseInfo,
  SeverityLevel,
} from "../DiseaseDetect.types";

export const commonSymptoms: Record<AnimalId, string[]> = {
  dog: [
    "Itching/Scratching",
    "Hair Loss",
    "Red/Inflamed Skin",
    "Scabs/Crusts",
    "Bad Odor",
    "Excessive Licking",
  ],
  cat: [
    "Excessive Grooming",
    "Hair Loss",
    "Scabs",
    "Red Patches",
    "Flaky Skin",
    "Behavioral Changes",
  ],
  cow: [
    "Skin Lesions",
    "Hair Loss",
    "Thickened Skin",
    "Scabs",
    "Swelling",
    "Discoloration",
  ],
};

export const mockDiseases: Record<AnimalId, Record<string, DiseaseInfo>> = {
  dog: {
    "Bacterial Dermatitis": {
      confidence: 87,
      severity: "medium",
      description: "Bacterial skin infection causing inflammation and pustules",
      symptoms: [
        "Red, inflamed skin",
        "Pustules or bumps",
        "Hair loss",
        "Itching",
      ],
      treatment: {
        medication: "Cephalexin 500mg",
        dosage: "2 times daily for 10-14 days",
        topical: "Chlorhexidine shampoo twice weekly",
        additional: [
          "Keep affected area clean and dry",
          "Prevent licking with E-collar if needed",
        ],
      },
      urgency: "Moderate - Start treatment within 2-3 days",
    },
  },
  cat: {
    "Feline Dermatitis": {
      confidence: 92,
      severity: "low",
      description: "Allergic skin reaction causing itching and inflammation",
      symptoms: [
        "Excessive scratching",
        "Red, irritated skin",
        "Small scabs",
        "Hair thinning",
      ],
      treatment: {
        medication: "Prednisolone 5mg",
        dosage: "1 tablet daily for 5 days, then every other day",
        topical: "Hydrocortisone cream (pet-safe) twice daily",
        additional: [
          "Identify and remove allergen",
          "Use hypoallergenic diet trial",
        ],
      },
      urgency: "Low - Monitor and treat within a week",
    },
  },
  cow: {
    "Ringworm (Dermatophytosis)": {
      confidence: 94,
      severity: "high",
      description: "Fungal infection causing circular patches of hair loss",
      symptoms: [
        "Circular bald patches",
        "Scaly, crusty skin",
        "Mild itching",
        "Spreading lesions",
      ],
      treatment: {
        medication: "Griseofulvin powder",
        dosage: "Mix in feed as per veterinary guidance",
        topical: "Miconazole/Chlorhexidine wash weekly",
        additional: [
          "Isolate affected animals",
          "Disinfect equipment and housing",
          "High contagion risk",
        ],
      },
      urgency: "High - Immediate treatment required (contagious)",
    },
  },
};

export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export const prompt = ({
  selectedAnimal,
  symptoms,
}: {
  selectedAnimal: string;
  symptoms: string[];
}) => `You are a veterinary AI assistant. Given an image of a ${selectedAnimal}, analyze and respond ONLY in JSON format. Your response MUST include ALL of the following fields, with NO extra fields, NO markdown, NO explanation, and NO code block:

{
  "disease": string, // Name of the disease or condition detected. REQUIRED. Example: "Ring worm"
  "description": string, // Detailed description of the findings. REQUIRED.
  "symptoms": string[], // Array of symptoms. REQUIRED. Example: ["Redness", "Inflammation", "Skin lesion"]
  "severity": string, // REQUIRED. One of: "high", "medium", "low" ONLY. Example: "medium"
  "confidence": number, // REQUIRED. Confidence score between 0 and 1. Example: 0.85
  "treatment": {
    "medication": string, // REQUIRED. Name of medication(s) recommended.
    "dosage": string, // REQUIRED. Dosage instructions.
    "topical": string, // REQUIRED. Topical treatment instructions.
    "additional": string[] // REQUIRED. Array of additional care instructions.
  },
  "urgency": string // REQUIRED. Urgency of treatment or vet visit.
}

REPEAT: You MUST return ALL fields above, even if you are unsure. Do NOT omit any field. Do NOT add any extra field. Do NOT return markdown, code block, or explanation. ONLY return the JSON object above, with all fields present and filled. If a value is unknown, use an empty string or empty array, but the field MUST be present. Example for symptoms: "symptoms": ["Redness", "Inflammation"].

Also, consider these observed symptoms: ${symptoms.join(", ") || "none"}.

REPEAT: Return ONLY the JSON object, with ALL required fields, NO extra fields, NO markdown, NO explanation, NO code block.`;

export const animalTypes: AnimalType[] = [
  { id: "dog", name: "Dog", icon: "🐕" },
  { id: "cat", name: "Cat", icon: "🐱" },
  { id: "cow", name: "Cow", icon: "🐄" },
];
