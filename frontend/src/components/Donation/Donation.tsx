import React, { use, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { jsx } from 'react/jsx-runtime'

interface DonationForm {
  name: string
  email: string
  amount: number
}

interface DonationStats {
  totalRaised: number
  donorCount: number
  recentDonations: Array<{
    _id: string
    name: string
    amount: number
    donatedAt: string
  }>
}

const Donation: React.FC = () => {
  const [formData, setFormData] = useState<DonationForm>({
    name: '',
    email: '',
    amount: 0,
  })

  const [stats, setStats] = useState<DonationStats>({
    totalRaised: 0,
    donorCount: 0,
    recentDonations: [],
  })

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [donatedAmount, setDonatedAmount] = useState<number>(0)
  const [donorEmail, setDonorEmail] = useState<string>('')

  const GOAL_AMOUNT = 50000

  useEffect(() => {
    fetchDonationStats()
  }, [])

  const fetchDonationStats = async () => {
    try {
      console.log(
        'Fetching donation stats from:',
        'http://localhost:3000/api/donations/stats'
      )
      const response = await fetch('http://localhost:3000/api/donations/stats')

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(
          `Failed to fetch donation stats: ${response.status} - ${errorText}`
        )
      }

      const data = await response.json()
      console.log('Fetched stats:', data)
      setStats(data)
    } catch (err) {
      console.error('Error fetching donation stats:', err)
      setError(
        `Failed to load donation statistics: ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  }
  // Predefined donation amounts
  const quickAmounts = [25, 50, 100, 250, 500, 1000]

  // Mock trust fund data
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setFormData(prev => ({ ...prev, amount }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))

    // Reset selected amount if custom amount is being entered
    if (name === 'amount') {
      setSelectedAmount(null)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // Reset form data when modal closes
    setFormData({ name: '', email: '', amount: 0 })
    setSelectedAmount(null)
    setDonatedAmount(0)
    setDonorEmail('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || formData.amount <= 0) {
      alert('Please fill out all the details')
      return
    }
    setLoading(true)
    setError(null)
    try {
      console.log('Submitting donation:', formData)

      const response = await fetch('http://localhost:3000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('Donation response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Donation error response:', errorText)
        throw new Error(
          `Failed to process donation: ${response.status} - ${errorText}`
        )
      }

      const result = await response.json()
      console.log('Donation successful:', result)

      // Store donation details before resetting form
      console.log('Setting donated amount to:', formData.amount)
      setDonatedAmount(formData.amount)
      setDonorEmail(formData.email)

      // Show modal first
      setShowModal(true)

      // Refresh stats in background
      fetchDonationStats()

      // Reset form (don't reset immediately to avoid timing issues)
    } catch (err) {
      console.error('Error processing donation', err)
      setError('Faile dto proess donation. Please try again later ')
    } finally {
      setLoading(false)
    }
  }
  const progressPercentage = Math.min(
    (stats.totalRaised / GOAL_AMOUNT) * 100,
    100
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help Save Lives, One Rescue at a Time
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your donation helps us rescue, rehabilitate, and find loving homes
            for animals in need. Every contribution makes a difference in an
            animal's life.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center">
              <span className="text-3xl mr-2"></span>
            </div>
            <div className="flex items-center">
              <span className="text-3xl mr-2"></span>
            </div>
            <div className="flex items-center">
              <span className="text-3xl mr-2"></span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Make a Donation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount ($)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                        selectedAmount === amount
                          ? 'border-purple-500 bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Custom Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter custom amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || formData.amount <= 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors shadow-lg ${
                  loading || formData.amount <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {loading
                  ? 'Processing...'
                  : `Donate Now - $${formData.amount || '0'}`}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              Your donation is secure and helps animals in need. Thank you for
              your generosity!
            </p>
          </div>

          {/* Trust Fund Summary */}
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Trust Fund Progress
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    ${stats.totalRaised.toLocaleString()} / $
                    {GOAL_AMOUNT.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {progressPercentage.toFixed(1)}% of goal reached
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    ${stats.totalRaised.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.donorCount}
                  </div>
                  <div className="text-sm text-gray-600">Donors</div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Recent Donations
              </h3>

              <div className="space-y-4">
                {stats.recentDonations.length > 0 ? (
                  stats.recentDonations.map((donation, index) => (
                    <div
                      key={donation._id || index}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {donation.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(donation.donatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-bold text-purple-600">
                        ${donation.amount}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No donations yet. Be the first to contribute!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Thank You for Your Donation!
              </h3>
              <p className="text-gray-600 mb-6">
                Your generous donation of{' '}
                <span className="font-bold text-purple-600">
                  ${donatedAmount}
                </span>{' '}
                will help us rescue and care for animals in need. Thank you for
                making a difference!
              </p>
              {/* Debug info - remove this later */}
              <div className="text-xs text-gray-400 mb-4">
                Debug: donatedAmount = {donatedAmount}
              </div>
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Donation
