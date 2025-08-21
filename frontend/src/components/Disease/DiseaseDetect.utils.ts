import type { DiseaseInfo } from "../DiseaseDetect.types";
import type { AnimalId, SeverityLevel } from "./DiseaseDetect";

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
