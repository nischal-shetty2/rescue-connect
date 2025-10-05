import React, { useState, useRef, type ChangeEvent } from 'react'
import {
  Upload,
  Zap,
  CheckCircle,
  X,
  Stethoscope,
  Clock,
  ArrowRight,
  Eye,
  FileText,
} from 'lucide-react'

import {
  mockDiseases,
  commonSymptoms,
  getSeverityColor,
} from './DiseaseDetect.utils'
import { Disclaimer, Stats } from './DisclaimerAndStats'
import type { AnalysisResult, AnimalType } from '../DiseaseDetect.types'

export type AnimalId = 'dog' | 'cat' | 'cow'
export type SeverityLevel = 'high' | 'medium' | 'low'

const animalTypes: AnimalType[] = [
  { id: 'dog', name: 'Dog', icon: '🐕' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'cow', name: 'Cow', icon: '🐄' },
]

const DetectDiseasePage: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalId>('dog')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  )
  const [showSymptomForm, setShowSymptomForm] = useState<boolean>(false)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setUploadedImage(e.target.result)
          setAnalysisResult(null)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async (): Promise<void> => {
    if (!uploadedImage) return

    setIsAnalyzing(true)

    try {
      // Convert base64 to blob for sending to Express backend
      const response = await fetch(uploadedImage)
      const blob = await response.blob()

      // Create FormData for the Express backend (which forwards to Flask + Groq)
      const formData = new FormData()
      formData.append('image', blob, 'image.jpg')
      formData.append('animalType', selectedAnimal)
      formData.append('symptoms', JSON.stringify(symptoms))

      // Call Express backend which will forward to Flask and enhance with Groq
      const apiResponse = await fetch('http://localhost:3000/diagnose', {
        method: 'POST',
        body: formData,
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}))
        throw new Error(
          errorData.error || `HTTP ${apiResponse.status}: Analysis failed`
        )
      }

      const result = await apiResponse.json()

      // Set the analysis result with the actual CNN model prediction
      setAnalysisResult({
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        description: result.description,
        symptoms: result.symptoms,
        treatment: result.treatment,
        urgency: result.urgency,
        analysisTime: new Date().toLocaleTimeString(),
        // Additional data from enhanced model response
        allProbabilities: result.allProbabilities,
      })

      console.log('Enhanced Analysis Result (CNN + Groq):', result)
    } catch (error) {
      console.error('Analysis error:', error)

      // Show user-friendly error message
      alert(
        `Analysis failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please check if the Express server is running on http://localhost:3000`
      )

      // Fallback to mock data if API fails (for development)
      const diseaseKey = Object.keys(mockDiseases[selectedAnimal])[0]
      const mockResult = mockDiseases[selectedAnimal][diseaseKey]

      setAnalysisResult({
        disease: `${diseaseKey} (Mock Data - Express/Flask API Error)`,
        ...mockResult,
        analysisTime: new Date().toLocaleTimeString(),
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSymptomToggle = (symptom: string): void => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleFileInputClick = (): void => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (): void => {
    setUploadedImage(null)
  }

  const handleAnimalSelect = (animalId: AnimalId): void => {
    setSelectedAnimal(animalId)
  }

  const toggleSymptomForm = (): void => {
    setShowSymptomForm(!showSymptomForm)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Upload Image for Analysis
            </h2>

            {/* Animal Selection */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Select Animal Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {animalTypes.map(animal => (
                  <button
                    key={animal.id}
                    onClick={() => handleAnimalSelect(animal.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedAnimal === animal.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-3">{animal.icon}</div>
                    <div className="font-bold">{animal.name}</div>
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
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
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
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
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
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  {showSymptomForm ? 'Hide' : 'Add Symptoms'}
                </button>
              </div>

              {showSymptomForm && (
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms[selectedAnimal].map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        symptoms.includes(symptom)
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
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
                  Upload an image to get started with analysis
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
                {/* Medical Disclaimer */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-800">
                        <strong>Important Notice:</strong> The prediction you
                        see here is meant to give an early indication. It should
                        not be taken as medical advice. For accurate diagnosis
                        and care, a qualified vet must be consulted.
                      </p>
                    </div>
                  </div>
                </div>

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
                      )}`}
                    >
                      {analysisResult.severity.charAt(0).toUpperCase() +
                        analysisResult.severity.slice(1)}{' '}
                      Severity
                    </div>
                  </div>
                </div>

                {/* CNN Model Probability Breakdown */}
                {analysisResult.allProbabilities && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2" />
                      CNN Model Predictions:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analysisResult.allProbabilities).map(
                        ([condition, probability]) => (
                          <div
                            key={condition}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium text-blue-800">
                              {condition}:
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-blue-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${probability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-blue-900 min-w-12">
                                {probability.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Common Symptoms:
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {analysisResult.symptoms.map((symptom, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
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

        <div className="text-center my-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Disease Detection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, accurate diagnosis for skin diseases in dogs, cats, and
            cows. Our advanced model analyzes images and symptoms to provide
            treatment recommendations.
          </p>
        </div>

        <Stats />

        <Disclaimer />
      </div>
    </div>
  )
}

export default DetectDiseasePage
