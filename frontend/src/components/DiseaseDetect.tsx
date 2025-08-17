import React, { useState, useRef, type ChangeEvent } from "react";
import {
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
  X,
  Stethoscope,
  Clock,
  Shield,
  ArrowRight,
  Eye,
  FileText,
} from "lucide-react";

// Types
interface AnimalType {
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

interface DiseaseInfo {
  confidence: number;
  severity: "high" | "medium" | "low";
  description: string;
  symptoms: string[];
  treatment: Treatment;
  urgency: string;
}

interface AnalysisResult extends DiseaseInfo {
  disease: string;
  analysisTime: string;
}

type AnimalId = "dog" | "cat" | "cow";
type SeverityLevel = "high" | "medium" | "low";

const DetectDiseasePage: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalId>("dog");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [showSymptomForm, setShowSymptomForm] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const animalTypes: AnimalType[] = [
    { id: "dog", name: "Dog", icon: "🐕" },
    { id: "cat", name: "Cat", icon: "🐱" },
    { id: "cow", name: "Cow", icon: "🐄" },
  ];

  const commonSymptoms: Record<AnimalId, string[]> = {
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

  // Mock disease database with treatments
  const mockDiseases: Record<AnimalId, Record<string, DiseaseInfo>> = {
    dog: {
      "Bacterial Dermatitis": {
        confidence: 87,
        severity: "medium",
        description:
          "Bacterial skin infection causing inflammation and pustules",
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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === "string") {
          setUploadedImage(e.target.result);
          setAnalysisResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock analysis result
    const diseaseKey = Object.keys(mockDiseases[selectedAnimal])[0];
    const result = mockDiseases[selectedAnimal][diseaseKey];

    setAnalysisResult({
      disease: diseaseKey,
      ...result,
      analysisTime: new Date().toLocaleTimeString(),
    });

    setIsAnalyzing(false);
  };

  const handleSymptomToggle = (symptom: string): void => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getSeverityColor = (severity: SeverityLevel): string => {
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
  };

  const handleFileInputClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (): void => {
    setUploadedImage(null);
  };

  const handleAnimalSelect = (animalId: AnimalId): void => {
    setSelectedAnimal(animalId);
  };

  const toggleSymptomForm = (): void => {
    setShowSymptomForm(!showSymptomForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Disease Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, accurate diagnosis for skin diseases in dogs, cats, and
            cows. Our advanced AI analyzes images and symptoms to provide
            treatment recommendations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">&lt;30s</div>
            <div className="text-gray-600">Analysis Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Disease Types</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Image for Analysis
            </h2>

            {/* Animal Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Animal Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {animalTypes.map((animal) => (
                  <button
                    key={animal.id}
                    onClick={() => handleAnimalSelect(animal.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAnimal === animal.id
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="text-2xl mb-2">{animal.icon}</div>
                    <div className="font-medium">{animal.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Image
              </label>

              {!uploadedImage ? (
                <div
                  onClick={handleFileInputClick}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Additional Symptoms */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Additional Symptoms (Optional)
                </label>
                <button
                  onClick={toggleSymptomForm}
                  className="text-blue-600 text-sm hover:text-blue-700">
                  {showSymptomForm ? "Hide" : "Add Symptoms"}
                </button>
              </div>

              {showSymptomForm && (
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms[selectedAnimal].map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        symptoms.includes(symptom)
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!uploadedImage || isAnalyzing}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Disease
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Analysis Results
            </h2>

            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Upload an image to get started with AI analysis
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-2">Analyzing image...</p>
                <p className="text-sm text-gray-500">
                  This may take up to 30 seconds
                </p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                {/* Diagnosis */}
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Detected: {analysisResult.disease}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {analysisResult.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">
                        {analysisResult.confidence}% Confidence
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm border ${getSeverityColor(
                        analysisResult.severity
                      )}`}>
                      {analysisResult.severity.charAt(0).toUpperCase() +
                        analysisResult.severity.slice(1)}{" "}
                      Severity
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Common Symptoms:
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {analysisResult.symptoms.map((symptom, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Recommended Treatment
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">
                        Medication:
                      </span>
                      <p className="text-gray-600">
                        {analysisResult.treatment.medication}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dosage: {analysisResult.treatment.dosage}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Topical Treatment:
                      </span>
                      <p className="text-gray-600">
                        {analysisResult.treatment.topical}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Additional Care:
                      </span>
                      <ul className="list-disc list-inside text-gray-600 text-sm mt-1">
                        {analysisResult.treatment.additional.map(
                          (care, idx) => (
                            <li key={idx}>{care}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Urgency */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-gray-900">
                      Treatment Urgency:
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{analysisResult.urgency}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Find Nearby Vet
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                    Save Report
                  </button>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  Analysis completed at {analysisResult.analysisTime}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Important Medical Disclaimer
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                This AI diagnosis tool is designed to assist with preliminary
                assessment only. It should not replace professional veterinary
                consultation. For serious conditions, persistent symptoms, or
                emergency situations, please consult a qualified veterinarian
                immediately. The accuracy of results depends on image quality
                and may vary based on individual cases.
              </p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How Our AI Detection Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Upload Image
              </h3>
              <p className="text-gray-600 text-sm">
                Take a clear photo of the affected skin area
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. AI Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms analyze visual patterns and symptoms
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Disease Identification
              </h3>
              <p className="text-gray-600 text-sm">
                Get confident diagnosis with severity assessment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4. Treatment Plan
              </h3>
              <p className="text-gray-600 text-sm">
                Receive detailed medication and care recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectDiseasePage;
