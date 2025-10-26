import React, { useState, useEffect } from 'react'

interface MarketplaceItem {
  _id: string
  name: string
  seller: string
  image: string
  link: string
}

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/marketplace')
        if (!response.ok) {
          throw new Error('Failed to fetch marketplace items')
        }
        const data = await response.json()
        setItems(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load marketplace items')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="marketplace-container">
      <h1 className="text-2xl font-bold text-center my-6">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {items.map(item => (
          <div
            key={item._id}
            className="card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    'https://via.placeholder.com/300x200?text=No+Image'
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Seller: {item.seller}
              </p>
              <button
                onClick={() => window.open(item.link, '_blank')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
