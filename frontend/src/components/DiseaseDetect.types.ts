// Types for DiseaseDetect
export type AnimalId = 'dog' | 'cat' | 'cow';
export type SeverityLevel = 'high' | 'medium' | 'low';

export interface AnimalType {
  id: AnimalId
  name: string
  icon: string
}

interface Treatment {
  medication: string
  dosage: string
  topical: string
  additional: string[]
}

export interface DiseaseInfo {
  confidence: number
  severity: SeverityLevel
  description: string
  symptoms: string[]
  treatment: Treatment
  urgency: string
}

export interface AnalysisResult extends DiseaseInfo {
  disease: string
  analysisTime: string
  allProbabilities?: {
    Bacterial: number
    Fungal: number
    Healthy: number
  }
}
