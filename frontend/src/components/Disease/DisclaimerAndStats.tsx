import { AlertTriangle, Upload, Zap, Shield, FileText } from 'lucide-react'

export const Disclaimer = () => {
  return (
    <>
      {/* Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">
              Important Medical Disclaimer
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              This AI diagnosis tool is designed to assist with preliminary
              assessment only. It should not replace professional veterinary
              consultation. For serious conditions, persistent symptoms, or
              emergency situations, please consult a qualified veterinarian
              immediately. The accuracy of results depends on image quality and
              may vary based on individual cases.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          How Our AI Detection Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              1. Upload Image
            </h3>
            <p className="text-gray-600 text-sm">
              Take a clear photo of the affected skin area
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced algorithms analyze visual patterns and symptoms
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              3. Disease Identification
            </h3>
            <p className="text-gray-600 text-sm">
              Get confident diagnosis with severity assessment
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              4. Treatment Plan
            </h3>
            <p className="text-gray-600 text-sm">
              Receive detailed medication and care recommendations
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          95%
        </div>
        <div className="text-gray-600 font-medium">Accuracy Rate</div>
      </div>
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          &lt;30s
        </div>
        <div className="text-gray-600 font-medium">Analysis Time</div>
      </div>
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          50+
        </div>
        <div className="text-gray-600 font-medium">Disease Types</div>
      </div>
    </div>
  )
}
