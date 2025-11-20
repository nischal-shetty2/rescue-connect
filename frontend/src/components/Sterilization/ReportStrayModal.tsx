import React, { useState, useRef } from 'react';
import { X, Upload, MapPin } from 'lucide-react';

interface ReportStrayModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const ReportStrayModal: React.FC<ReportStrayModalProps> = ({ onClose, onSubmit }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [animalType, setAnimalType] = useState<'dog' | 'cat' | 'other'>('dog');
    const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('unknown');
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        earsNotched: 'not_sure',
        hasCollar: 'no',
        surgicalMarks: 'no',
        isLactating: 'not_sure',
        isPregnant: 'not_sure',
        recentlyDelivered: 'not_sure',
        testicularIssues: 'not_sure',
        isFriendly: 'not_sure',
        showsAggression: 'no',
        allowsTouch: 'depends'
    });

    // ImgBB API key from environment variable
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        setUploadingImage(true);

        try {
            // Convert file to base64 for ImgBB
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove data:image/...;base64, prefix
                    const base64String = result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Upload to ImgBB
            const formData = new FormData();
            formData.append('image', base64);
            formData.append('key', IMGBB_API_KEY);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();

            if (data.success) {
                setUploadedImageUrl(data.data.url);
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Reverse geocoding to get address
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        });
                    } catch (error) {
                        setLocation({
                            lat: latitude,
                            lng: longitude,
                            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                        });
                    }
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Please enable location services.');
                    setIsGettingLocation(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
            setIsGettingLocation(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadedImageUrl) {
            alert('Please upload an image of the animal');
            return;
        }

        if (!location.lat || !location.lng) {
            alert('Please get your current location');
            return;
        }

        onSubmit({
            imageUrl: uploadedImageUrl,
            animalType,
            gender,
            location,
            surveyData: formData
        });
    };

    const RadioGroup = ({ label, name, options, value, onChange }: any) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((option: any) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(name, option.value)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${value === option.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                    <h3 className="text-xl font-bold text-gray-900">Report Stray Animal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Upload Animal Photo *</label>
                        {!uploadedImageUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">
                                    {uploadingImage ? 'Uploading...' : 'Click to upload an image'}
                                </p>
                                <p className="text-sm text-gray-500">Supports JPG, PNG</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={uploadedImageUrl}
                                    alt="Uploaded"
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setUploadedImageUrl('')}
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
                            disabled={uploadingImage}
                            className="hidden"
                        />
                    </div>

                    {/* Animal Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Animal Type *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['dog', 'cat', 'other'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setAnimalType(type);
                                    }}
                                    className={`p-3 rounded-xl border-2 transition-all capitalize ${animalType === type
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Gender *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['male', 'female', 'unknown'] as const).map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGender(g)}
                                    className={`p-3 rounded-xl border-2 transition-all capitalize ${gender === g
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Location *</label>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPin className="w-4 h-4" />
                            {isGettingLocation ? 'Getting Location...' : location.address ? 'Update Location' : 'Get Current Location'}
                        </button>
                        {location.address && (
                            <p className="text-sm text-gray-600 mt-2">📍 {location.address}</p>
                        )}
                    </div>

                    <hr className="border-gray-200" />
                    <h4 className="font-bold text-gray-900">Survey Questions</h4>

                    {/* Survey Questions */}
                    <RadioGroup
                        label="Are the ears notched?"
                        name="earsNotched"
                        value={formData.earsNotched}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                            { value: 'not_sure', label: 'Not Sure' }
                        ]}
                    />

                    <RadioGroup
                        label="Does the animal have a collar or tag?"
                        name="hasCollar"
                        value={formData.hasCollar}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                        ]}
                    />

                    <RadioGroup
                        label="Any visible surgical marks on the abdomen?"
                        name="surgicalMarks"
                        value={formData.surgicalMarks}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                        ]}
                    />

                    {gender === 'female' && (
                        <>
                            <RadioGroup
                                label="For females: Is the animal currently lactating?"
                                name="isLactating"
                                value={formData.isLactating}
                                onChange={handleRadioChange}
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'not_sure', label: 'Not Sure' }
                                ]}
                            />

                            <RadioGroup
                                label="For females: Is the animal pregnant?"
                                name="isPregnant"
                                value={formData.isPregnant}
                                onChange={handleRadioChange}
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'not_sure', label: 'Not Sure' },
                                    { value: 'suspected', label: 'Suspected' }
                                ]}
                            />

                            <RadioGroup
                                label="For females: Has the animal recently delivered puppies/kittens?"
                                name="recentlyDelivered"
                                value={formData.recentlyDelivered}
                                onChange={handleRadioChange}
                                options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'not_sure', label: 'Not Sure' }
                                ]}
                            />
                        </>
                    )}

                    {gender === 'male' && (
                        <RadioGroup
                            label="For males: Is the animal showing signs of testicular swelling or infection?"
                            name="testicularIssues"
                            value={formData.testicularIssues}
                            onChange={handleRadioChange}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                                { value: 'not_sure', label: 'Not Sure' }
                            ]}
                        />
                    )}

                    <RadioGroup
                        label="Is the animal friendly and approachable?"
                        name="isFriendly"
                        value={formData.isFriendly}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                            { value: 'not_sure', label: 'Not Sure' }
                        ]}
                    />

                    <RadioGroup
                        label="Does the animal show aggression?"
                        name="showsAggression"
                        value={formData.showsAggression}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'sometimes', label: 'Sometimes' },
                            { value: 'no', label: 'No' }
                        ]}
                    />

                    <RadioGroup
                        label="Does the animal allow human touch?"
                        name="allowsTouch"
                        value={formData.allowsTouch}
                        onChange={handleRadioChange}
                        options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                            { value: 'depends', label: 'Depends' }
                        ]}
                    />

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportStrayModal;
