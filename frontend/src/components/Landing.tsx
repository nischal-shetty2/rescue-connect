import {
  Camera,
  MapPin,
  Users,
  Stethoscope,
  Home,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Star,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  // Helper to check if user is logged in
  const isLoggedIn = !!localStorage.getItem('currentUser')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting Hearts to
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}
                Rescue Animals
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Advanced AI-powered platform for animal rescue, disease detection,
              and care services. Bridging communities to save lives, one paw at
              a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group shadow-lg"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate('/adopt')
                  } else {
                    navigate('/login')
                  }
                }}
              >
                Start Rescuing
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    navigate('/disease')
                  } else {
                    navigate('/login')
                  }
                }}
                className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 text-indigo-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:border-indigo-400 hover:text-indigo-800 transition-all duration-300 hover:shadow-xl"
              >
                Detect Disease
              </button>
            </div>
          </div>

          {/* Hero Image/Stats */}
          <div className="mt-16 relative">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    500+
                  </div>
                  <div className="text-gray-600 mt-2 font-medium">
                    Animals Rescued
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    95%
                  </div>
                  <div className="text-gray-600 mt-2 font-medium">
                    Disease Detection Accuracy
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    1000+
                  </div>
                  <div className="text-gray-600 mt-2 font-medium">
                    Happy Adopters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Care Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with compassionate
              care to create the most comprehensive animal rescue and welfare
              system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer border border-gray-100 hover:border-indigo-200"
              >
                <div className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Learn more
                  <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How Rescue Connect Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to make a difference in animal welfare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your profile as a rescuer, adopter, or service provider
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Get matched with nearby rescuers, adopters, or animals in need
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Care</h3>
              <p className="text-gray-600">
                Use AI diagnosis, find vets, or access boarding services
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-3xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600">
                Make a lasting difference in animal welfare and community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Trusted by Animal Lovers
            </h2>
            <p className="text-xl text-gray-600">
              See what our community members have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of animal lovers who are already using Rescue Connect
            to save lives and build stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 backdrop-blur-sm">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing

const features = [
  {
    icon: <Camera className="w-8 h-8" />,
    title: 'AI Disease Detection',
    description:
      'Advanced skin disease prediction for dogs, cats, and cows with instant treatment recommendations.',
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Location-Based Matching',
    description:
      'Connect rescuers and adopters based on proximity for faster, more efficient animal rescue.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Ethical Breeding',
    description:
      'Verified marketplace for ethical breeders with transparent breeding practice documentation.',
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: 'Vet Services',
    description:
      'Find nearby veterinarians and specialized care services for your rescued animals.',
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Pet Boarding',
    description:
      'Trusted boarding houses and temporary care facilities for animals in need.',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Trust Fund Donations',
    description:
      'Support rescue operations and medical treatments through our dedicated trust fund.',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Animal Rescuer',
    content:
      'Rescue Connect helped me save 15 dogs this month. The location matching is incredible!',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Veterinarian',
    content:
      'The AI disease detection feature has revolutionized how we diagnose skin conditions.',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    role: 'Pet Adopter',
    content:
      "Found my perfect companion through their matchmaking system. Couldn't be happier!",
    rating: 5,
  },
]
