import { Heart } from 'lucide-react'

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Rescue Connect</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Connecting communities to rescue and care for animals in need
            through technology and compassion.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Platform</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Disease Detection
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Match Finder
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Veterinary Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Boarding Houses
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Community</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                For Rescuers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                For Adopters
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                For Breeders
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Success Stories
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>
          &copy; 2025 Rescue Connect. All rights reserved. Made with ❤️ for
          animals in need.
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
