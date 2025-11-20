import { useState, useEffect } from 'react'
import { Syringe, Plus } from 'lucide-react'
import StrayMap from './StrayMap'
import SterilizationSurvey from './SterilizationSurvey'
import ReportStrayModal from './ReportStrayModal'
import { getStrays, updateStraySurvey, createStray, type Stray } from '../../services/strayService'

const Sterilization = () => {
    const [strays, setStrays] = useState<Stray[]>([])
    const [selectedStray, setSelectedStray] = useState<Stray | null>(null)
    const [showSurvey, setShowSurvey] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStrays()
    }, [])

    const fetchStrays = async () => {
        try {
            const data = await getStrays()
            setStrays(data)
        } catch (error) {
            console.error('Error fetching strays:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStraySelect = (stray: Stray) => {
        setSelectedStray(stray)
        setShowSurvey(true)
    }

    const handleSurveySubmit = async (surveyData: any) => {
        if (!selectedStray) return

        try {
            await updateStraySurvey(selectedStray._id, surveyData)
            await fetchStrays() // Refresh data
            setShowSurvey(false)
            setSelectedStray(null)
        } catch (error) {
            console.error('Error updating survey:', error)
        }
    }

    const handleReportStray = async (reportData: any) => {
        try {
            const newStray = {
                imageUrl: reportData.imageUrl,
                location: reportData.location,
                isSterilized: false,
                animalType: reportData.animalType,
                gender: reportData.gender,
                surveyData: reportData.surveyData
            }

            await createStray(newStray)
            await fetchStrays()
            setShowReportModal(false)
        } catch (error) {
            console.error('Error creating stray:', error)
            alert('Failed to report stray. Please try again.')
        }
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Syringe className="w-6 h-6 text-indigo-600" />
                                Sterilization Drive
                            </h1>
                            <p className="text-sm text-gray-600">
                                Map and survey community animals to track sterilization efforts
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-4 text-sm mr-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span>Sterilized</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span>Not Sterilized</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Report Stray
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Content */}
            <div className="flex-1 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <StrayMap strays={strays} onStraySelect={handleStraySelect} />
                )}
            </div>

            {/* Survey Modal */}
            {showSurvey && selectedStray && (
                <SterilizationSurvey
                    stray={selectedStray}
                    onClose={() => setShowSurvey(false)}
                    onSubmit={handleSurveySubmit}
                />
            )}

            {/* Report Stray Modal */}
            {showReportModal && (
                <ReportStrayModal
                    onClose={() => setShowReportModal(false)}
                    onSubmit={handleReportStray}
                />
            )}
        </div>
    )
}

export default Sterilization
