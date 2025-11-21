import { useState, useEffect } from 'react'
import { ShieldCheck, Plus } from 'lucide-react'
import { getBreedingListings, type BreedingListing } from '../../services/breedingService'
import BreedingListingCard from './BreedingListingCard'
import AddBreedingListingModal from './AddBreedingListingModal'

const EthicalBreeding = () => {
    const [listings, setListings] = useState<BreedingListing[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchListings()
    }, [])

    const fetchListings = async () => {
        try {
            const data = await getBreedingListings()
            setListings(data)
        } catch (error) {
            console.error('Error fetching listings:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Ethical Breeding</h1>
                            <p className="mt-2 text-gray-600">Verified breeders committed to animal welfare standards</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            List Your Animal
                        </button>
                    </div>
                </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="bg-blue-600 text-white px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-start gap-3 text-sm">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                        <strong>Buyer Safety Warning:</strong> Rescue-Connect requires breeders to upload AWBI certificates, but we do not independently verify them.
                        Always verify the breeder's registration number directly with the Animal Welfare Board of India before making any payments.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading listings...</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Yet</h3>
                        <p className="text-gray-500 mb-6">Be the first ethical breeder to list an animal.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Create a Listing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map(listing => (
                            <BreedingListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <AddBreedingListingModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchListings}
                />
            )}
        </div>
    )
}

export default EthicalBreeding
