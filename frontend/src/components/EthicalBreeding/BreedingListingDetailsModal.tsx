import React, { useState } from 'react'
import { X, MapPin, Phone, ChevronLeft, ChevronRight, Award } from 'lucide-react'
import { type BreedingListing } from '../../services/breedingService'
import BreederComments from './BreederComments'

interface BreedingListingDetailsModalProps {
    listing: BreedingListing
    onClose: () => void
}

const BreedingListingDetailsModal: React.FC<BreedingListingDetailsModalProps> = ({ listing, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showCertificate, setShowCertificate] = useState(false)

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{listing.breed}</h2>
                        <p className="text-gray-500 text-sm">{listing.animalType} • {listing.age} months • {listing.gender}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6">

                        {/* Left Column: Images */}
                        <div className="bg-black flex flex-col">
                            {/* Main Image */}
                            <div className="relative h-64 lg:h-96 bg-black flex items-center justify-center group">
                                <img
                                    src={listing.images[currentImageIndex] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={`${listing.breed} - View ${currentImageIndex + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />

                                {listing.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                                    {currentImageIndex + 1} / {listing.images.length}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {listing.images.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-900">
                                    {listing.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${currentImageIndex === idx ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details */}
                        <div className="p-6 space-y-6">

                            {/* Price & Verification */}
                            <div className="flex justify-between items-start">
                                <div className="text-3xl font-bold text-indigo-600">
                                    ₹{listing.price.toLocaleString('en-IN')}
                                </div>

                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">About</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                            </div>

                            {/* Location & Contact */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                                    {listing.location}
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                    {listing.contactInfo.phone}
                                </div>
                                <div className="text-sm text-gray-500 pt-2 border-t border-gray-200 mt-2">
                                    Posted by <span className="font-medium text-gray-900">{listing.breederName}</span>
                                </div>
                            </div>

                            {/* AWBI Certificate */}
                            <div>
                                <button
                                    onClick={() => setShowCertificate(!showCertificate)}
                                    className="w-full flex items-center justify-between p-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                                >
                                    <span className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        View AWBI Registration Certificate
                                    </span>
                                    {showCertificate ? <ChevronLeft className="w-5 h-5 rotate-90" /> : <ChevronRight className="w-5 h-5" />}
                                </button>

                                {showCertificate && (
                                    <div className="mt-4 p-4 border-2 border-indigo-100 rounded-xl bg-white">
                                        <img
                                            src={listing.awbiCertificate}
                                            alt="AWBI Certificate"
                                            className="w-full rounded-lg shadow-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Always verify this certificate number directly with AWBI.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div className="pt-6 border-t border-gray-100">
                                <BreederComments breederId={listing.breederId} breederName={listing.breederName} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreedingListingDetailsModal
