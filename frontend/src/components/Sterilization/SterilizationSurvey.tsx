import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Stray } from '../../services/strayService';

interface SterilizationSurveyProps {
    stray: Stray;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const SterilizationSurvey: React.FC<SterilizationSurveyProps> = ({ stray, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        earNotched: false,
        surgicalScars: false,
        behavior: 'friendly',
        skinCondition: 'healthy',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Sterilization Survey</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Animal Image */}
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Ear Notch */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Is the left ear notched/tipped?
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, earNotched: true })}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.earNotched
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Check className="w-4 h-4" /> Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, earNotched: false })}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${!formData.earNotched
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <X className="w-4 h-4" /> No
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                * Ear tipping is the universal sign of a sterilized community dog.
                            </p>
                        </div>

                        {/* Surgical Scars */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Are there visible surgical scars on the abdomen?
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, surgicalScars: true })}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.surgicalScars
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Check className="w-4 h-4" /> Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, surgicalScars: false })}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${!formData.surgicalScars
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <X className="w-4 h-4" /> No
                                </button>
                            </div>
                        </div>

                        {/* Behavior */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Behavior</label>
                            <select
                                value={formData.behavior}
                                onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="friendly">Friendly</option>
                                <option value="shy">Shy/Fearful</option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>

                        {/* Skin Condition */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Skin Condition</label>
                            <select
                                value={formData.skinCondition}
                                onChange={(e) => setFormData({ ...formData, skinCondition: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="healthy">Healthy</option>
                                <option value="mange">Signs of Mange</option>
                                <option value="injured">Injured</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Submit Survey
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SterilizationSurvey;
