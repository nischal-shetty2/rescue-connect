import React, { useState, useRef } from 'react'
import { X, Upload, MapPin, AlertTriangle, Info } from 'lucide-react'
import { createBreedingListing } from '../../services/breedingService'

interface AddBreedingListingModalProps {
    onClose: () => void
    onSuccess: () => void
}

const AddBreedingListingModal: React.FC<AddBreedingListingModalProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Details, 2: Verification
    const fileInputRef = useRef<HTMLInputElement>(null)
    const certInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        animalType: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        price: '',
        description: '',
        location: '',
        contactPhone: '',
        contactEmail: '',
        breederName: '',
    })

    const [images, setImages] = useState<string[]>([])
    const [awbiCertificate, setAwbiCertificate] = useState<string>('')
    const [uploading, setUploading] = useState(false)

    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const uploadToImgBB = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('key', IMGBB_API_KEY)

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        return data.data.url
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        setUploading(true)
        try {
            const urls = await Promise.all(
                Array.from(e.target.files).map(file => uploadToImgBB(file))
            )
            setImages(prev => [...prev, ...urls])
        } catch (error) {
            console.error('Image upload failed:', error)
            alert('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setUploading(true)
        try {
            const url = await uploadToImgBB(e.target.files[0])
            setAwbiCertificate(url)
        } catch (error) {
            console.error('Certificate upload failed:', error)
            alert('Failed to upload certificate')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!awbiCertificate) {
            alert('You must upload your AWBI Registration Certificate to proceed.')
            return
        }

        setLoading(true)
        try {
            const user = JSON.parse(localStorage.getItem('currentUser') || '{}')

            await createBreedingListing({
                ...formData,
                age: Number(formData.age),
                price: Number(formData.price),
                images,
                awbiCertificate,
                breederId: user.id || user.email || 'anonymous', // Fallback
                breederName: formData.breederName || user.name || 'Anonymous Breeder',
                contactInfo: {
                    phone: formData.contactPhone,
                    email: formData.contactEmail,
                }
            })

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Failed to create listing:', error)
            alert('Failed to create listing. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? 'List Animal for Adoption/Sale' : 'Verify Breeder Status'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                                    <select
                                        name="animalType"
                                        value={formData.animalType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="e.g. Golden Retriever"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (Months)</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0 for free"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Tell us about the animal..."
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                                    >
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-xs">Add Photo</span>
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-900">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Breeder Name</label>
                                        <input
                                            type="text"
                                            name="breederName"
                                            value={formData.breederName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="City, State"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Verification Step */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-bold mb-1">Disclaimer:</p>
                                    <p className="mb-2">
                                        Rescue-Connect allows breeder listings only from individuals or organizations claiming to be registered with the Animal Welfare Board of India (AWBI). All breeders must upload their AWBI Registration Certificate and provide their official breeder registration number.
                                    </p>
                                    <p className="mb-2">
                                        However, Rescue-Connect is not responsible for any forged, invalid or misleading certificates uploaded by users.
                                        We strongly advise all adopters to independently verify the AWBI registration number of the breeder before proceeding with adoption, purchase, or communication.
                                    </p>
                                    <p>
                                        To ensure safety and transparency, adopters must confirm the authenticity of the breeder’s registration by directly contacting the Animal Welfare Board of India (AWBI) via email.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Upload AWBI Registration Certificate *
                                </label>
                                <div
                                    onClick={() => certInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${awbiCertificate ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                                        }`}
                                >
                                    {awbiCertificate ? (
                                        <div className="flex flex-col items-center text-green-700">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="font-medium">Certificate Uploaded</p>
                                            <p className="text-xs mt-1">Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload className="w-12 h-12 mb-2 text-gray-400" />
                                            <p className="font-medium">Click to upload certificate</p>
                                            <p className="text-xs mt-1">Supported formats: JPG, PNG</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={certInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCertUpload}
                                />
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>
                                    By proceeding, you certify that you are a registered breeder with valid AWBI documentation.
                                    Providing false information may result in legal action.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-4">
                    {step === 2 && (
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={step === 1 ? () => setStep(2) : handleSubmit}
                        disabled={loading || uploading || (step === 2 && !awbiCertificate)}
                        className="flex-1 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : step === 1 ? 'Next: Verification' : 'Submit Listing'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddBreedingListingModal
