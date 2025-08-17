import { useState, useEffect } from "react";
import {
  Heart,
  Camera,
  MapPin,
  Users,
  Stethoscope,
  Home,
  DollarSign,
  ChevronRight,
  Menu,
  X,
  Star,
  ArrowRight,
  PawPrint,
} from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI Disease Detection",
      description:
        "Advanced skin disease prediction for dogs, cats, and cows with instant treatment recommendations.",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location-Based Matching",
      description:
        "Connect rescuers and adopters based on proximity for faster, more efficient animal rescue.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Ethical Breeding",
      description:
        "Verified marketplace for ethical breeders with transparent breeding practice documentation.",
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Vet Services",
      description:
        "Find nearby veterinarians and specialized care services for your rescued animals.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Pet Boarding",
      description:
        "Trusted boarding houses and temporary care facilities for animals in need.",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Trust Fund Donations",
      description:
        "Support rescue operations and medical treatments through our dedicated trust fund.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Animal Rescuer",
      content:
        "Rescue Connect helped me save 15 dogs this month. The location matching is incredible!",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Veterinarian",
      content:
        "The AI disease detection feature has revolutionized how we diagnose skin conditions.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Pet Adopter",
      content:
        "Found my perfect companion through their matchmaking system. Couldn't be happier!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Rescue Connect
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                Testimonials
              </a>
              <button className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting Hearts to
              <span className="text-blue-600"> Rescue Animals</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Advanced AI-powered platform for animal rescue, disease detection,
              and care services. Bridging communities to save lives, one paw at
              a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group">
                Start Rescuing
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors">
                Detect Disease
              </button>
            </div>
          </div>

          {/* Hero Image/Stats */}
          <div className="mt-16 relative">
            <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                    500+
                  </div>
                  <div className="text-gray-600 mt-2">Animals Rescued</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                    95%
                  </div>
                  <div className="text-gray-600 mt-2">
                    Disease Detection Accuracy
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                    1000+
                  </div>
                  <div className="text-gray-600 mt-2">Happy Adopters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Rescue Connect Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to make a difference in animal welfare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sign Up
              </h3>
              <p className="text-gray-600">
                Create your profile as a rescuer, adopter, or service provider
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect
              </h3>
              <p className="text-gray-600">
                Get matched with nearby rescuers, adopters, or animals in need
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Care</h3>
              <p className="text-gray-600">
                Use AI diagnosis, find vets, or access boarding services
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Impact
              </h3>
              <p className="text-gray-600">
                Make a lasting difference in animal welfare and community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of animal lovers who are already using Rescue Connect
            to save lives and build stronger communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                    AI Disease Detection
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
    </div>
  );
};

export default App;
