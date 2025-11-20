import { Award, ShieldCheck } from 'lucide-react'

const EthicalBreeding = () => {
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
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                            Verify Breeder
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        We are building a network of certified ethical breeders.
                        This platform will ensure transparency and high standards of care for all animals.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EthicalBreeding
