import React, { useState } from 'react'
import { MapPin, Eye } from 'lucide-react'
import { type BreedingListing } from '../../services/breedingService'
import BreedingListingDetailsModal from './BreedingListingDetailsModal'

interface BreedingListingCardProps {
    listing: BreedingListing
}

const BreedingListingCard: React.FC<BreedingListingCardProps> = ({ listing }) => {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="relative h-64 cursor-pointer" onClick={() => setShowDetails(true)}>
                    <img
                        src={listing.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={`${listing.breed} ${listing.animalType} `}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-indigo-600 shadow-sm">
                        ₹{listing.price.toLocaleString('en-IN')}
                    </div>
                    {listing.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                            +{listing.images.length - 1} photos
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{listing.breed}</h3>
                            <p className="text-gray-500 text-sm">{listing.animalType} • {listing.age} months • {listing.gender}</p>
                        </div>

                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{listing.description}</p>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xs text-gray-500">Breeder</p>
                                <p className="font-medium text-gray-900">{listing.breederName}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetails(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-bold shadow-lg shadow-indigo-200"
                        >
                            <Eye className="w-4 h-4" />
                            View Details & Contact
                        </button>
                    </div>
                </div>
            </div>

            {showDetails && (
                <BreedingListingDetailsModal
                    listing={listing}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    )
}

export default BreedingListingCard
