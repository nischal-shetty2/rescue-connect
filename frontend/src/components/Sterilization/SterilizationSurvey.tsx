import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Info } from 'lucide-react';
import type { Stray } from '../../services/strayService';

interface SterilizationSurveyProps {
    stray: Stray;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const SterilizationSurvey: React.FC<SterilizationSurveyProps> = ({ stray, onClose, onSubmit }) => {
    // Initialize form data from stray.surveyData or defaults
    const [formData, setFormData] = useState({
        earsNotched: stray.surveyData?.earsNotched || 'not_sure',
        hasCollar: stray.surveyData?.hasCollar || 'no',
        surgicalMarks: stray.surveyData?.surgicalMarks || 'no',
        isLactating: stray.surveyData?.isLactating || 'not_sure',
        isPregnant: stray.surveyData?.isPregnant || 'not_sure',
        recentlyDelivered: stray.surveyData?.recentlyDelivered || 'not_sure',
        testicularIssues: stray.surveyData?.testicularIssues || 'not_sure',
        isFriendly: stray.surveyData?.isFriendly || 'not_sure',
        showsAggression: stray.surveyData?.showsAggression || 'no',
        allowsTouch: stray.surveyData?.allowsTouch || 'depends',
        notes: stray.surveyData?.notes || ''
    });

    // Update form data if stray changes
    useEffect(() => {
        if (stray.surveyData) {
            setFormData(prev => ({
                ...prev,
                ...stray.surveyData
            }));
        }
    }, [stray]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleRadioChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Stray Details</h3>
                        <p className="text-sm text-gray-500">View and update survey information</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                            <img
                                src={stray.imageUrl}
                                alt="Stray"
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${stray.isSterilized ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {stray.isSterilized ? 'Sterilized' : 'Not Sterilized'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Basic Info</p>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {stray.animalType || 'Unknown Type'} • {stray.gender || 'Unknown Gender'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Location</p>
                                        <p className="text-sm text-gray-600">{stray.location.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Reported On</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(stray.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h4 className="font-bold text-gray-900">Survey Questions</h4>

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

                        {stray.gender === 'female' && (
                            <>
                                <RadioGroup
                                    label="Is the animal currently lactating?"
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
                                    label="Is the animal pregnant?"
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
                                    label="Has the animal recently delivered puppies/kittens?"
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

                        {stray.gender === 'male' && (
                            <RadioGroup
                                label="Is the animal showing signs of testicular swelling or infection?"
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

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                placeholder="Any additional observations..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Update Survey
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SterilizationSurvey;
