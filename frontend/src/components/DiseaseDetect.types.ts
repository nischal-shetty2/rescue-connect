// Types for DiseaseDetect
export interface AnimalType {
  id: "dog" | "cat" | "cow";
  name: string;
  icon: string;
}

interface Treatment {
  medication: string;
  dosage: string;
  topical: string;
  additional: string[];
}

export interface DiseaseInfo {
  confidence: number;
  severity: "high" | "medium" | "low";
  description: string;
  symptoms: string[];
  treatment: Treatment;
  urgency: string;
}

export interface AnalysisResult extends DiseaseInfo {
  disease: string;
  analysisTime: string;
  allProbabilities?: {
    Bacterial: number;
    Fungal: number;
    Healthy: number;
  };
}
