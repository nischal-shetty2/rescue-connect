import { useState } from "react";
import {
  MapPin,
  Clock,
  Heart,
  Filter,
  Grid,
  List,
  Camera,
  AlertCircle,
  Star,
  Phone,
} from "lucide-react";

const dummyAnimals = [
  {
    id: 1,
    type: "Dog",
    name: "Buddy",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
    location: "MG Road, Bengaluru",
    distance: "2.1 km",
    info: "Healthy, friendly, needs shelter. Vaccinated.",
    urgency: "medium",
    age: "2 years",
    gender: "Male",
    rescuer: "Sarah Kumar",
    postedTime: "2 hours ago",
    condition: "Good",
    vaccinated: true,
    contact: "+91 98765 43210",
  },
  {
    id: 2,
    type: "Cow",
    name: "Gauri",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    location: "Indiranagar, Bengaluru",
    distance: "3.5 km",
    info: "Injured leg, needs medical attention. Docile.",
    urgency: "high",
    age: "Adult",
    gender: "Female",
    rescuer: "Ramesh Patel",
    postedTime: "30 minutes ago",
    condition: "Injured",
    vaccinated: false,
    contact: "+91 87654 32109",
  },
  {
    id: 3,
    type: "Cat",
    name: "Whiskers",
    image:
      "https://images.unsplash.com/photo-1518715308788-300e1e1b8a49?auto=format&fit=crop&w=400&q=80",
    location: "Koramangala, Bengaluru",
    distance: "1.2 km",
    info: "Young, scared, needs food and care.",
    urgency: "medium",
    age: "6 months",
    gender: "Female",
    rescuer: "Priya Singh",
    postedTime: "1 hour ago",
    condition: "Fair",
    vaccinated: true,
    contact: "+91 76543 21098",
  },
  {
    id: 4,
    type: "Dog",
    name: "Rocky",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
    location: "Whitefield, Bengaluru",
    distance: "5.8 km",
    info: "Abandoned puppy, very playful and energetic.",
    urgency: "low",
    age: "4 months",
    gender: "Male",
    rescuer: "John Matthew",
    postedTime: "4 hours ago",
    condition: "Good",
    vaccinated: false,
    contact: "+91 65432 10987",
  },
  {
    id: 5,
    type: "Cat",
    name: "Luna",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80",
    location: "HSR Layout, Bengaluru",
    distance: "4.2 km",
    info: "Pregnant cat, needs immediate shelter and care.",
    urgency: "high",
    age: "1.5 years",
    gender: "Female",
    rescuer: "Anjali Mehta",
    postedTime: "15 minutes ago",
    condition: "Pregnant",
    vaccinated: true,
    contact: "+91 54321 09876",
  },
];

const StartRescuingPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "injured":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pregnant":
        return <Heart className="w-4 h-4 text-pink-500" />;
      default:
        return <Star className="w-4 h-4 text-green-500" />;
    }
  };

  const filteredAnimals =
    selectedFilter === "all"
      ? dummyAnimals
      : dummyAnimals.filter(
          (animal) => animal.type.toLowerCase() === selectedFilter
        );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAnimals.map((animal) => (
        <div
          key={animal.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
          <div className="relative">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                  animal.urgency
                )}`}>
                {animal.urgency} priority
              </span>
            </div>
            <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
              <Camera className="w-3 h-3 inline mr-1" />
              {animal.postedTime}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">{animal.name}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {animal.type}
              </span>
            </div>

            <div className="flex items-center text-blue-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{animal.location}</span>
            </div>

            <div className="flex items-center text-gray-500 mb-3">
              <span className="text-sm">{animal.distance} away</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                {getConditionIcon(animal.condition)}
                <span className="text-sm ml-1">{animal.condition}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {animal.info}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>
                {animal.age} • {animal.gender}
              </span>
              <span className="flex items-center">
                {animal.vaccinated && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Vaccinated
                  </span>
                )}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group">
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Rescue Now
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Posted by{" "}
              <span className="font-medium text-gray-700">
                {animal.rescuer}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredAnimals.map((animal) => (
        <div
          key={animal.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group">
          <div className="flex gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                    animal.urgency
                  )}`}>
                  {animal.urgency}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {animal.name}
                    <span className="text-lg text-gray-500 font-normal ml-2">
                      ({animal.type})
                    </span>
                  </h3>
                  <div className="flex items-center text-blue-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="font-medium">{animal.location}</span>
                    <span className="text-gray-500 ml-3">
                      {animal.distance} away
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{animal.postedTime}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{animal.info}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {getConditionIcon(animal.condition)}
                  <span className="text-sm ml-1 text-gray-700">
                    {animal.condition}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-700">
                  {animal.age}, {animal.gender}
                </span>
                <span className="text-gray-400">•</span>
                {animal.vaccinated && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Vaccinated
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Posted by{" "}
                  <span className="font-medium text-gray-700">
                    {animal.rescuer}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center group">
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Rescue Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Animals Nearby Need Your Help
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with stray animals in your area and make a difference in
            their lives
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="cow">Cows</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Urgency</option>
                  <option>High Priority</option>
                  <option>Medium Priority</option>
                  <option>Low Priority</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Conditions</option>
                  <option>Good</option>
                  <option>Injured</option>
                  <option>Pregnant</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>Any Distance</option>
                  <option>Under 1km</option>
                  <option>Under 5km</option>
                  <option>Under 10km</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Ages</option>
                  <option>Young</option>
                  <option>Adult</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredAnimals.length}</span>{" "}
            animals near you
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Last updated: 1 Day ago</span>
          </div>
        </div>

        {/* Listings */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Load More Animals
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartRescuingPage;
