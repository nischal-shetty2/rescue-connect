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
  Plus,
  X,
  Upload,
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
      "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=788&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      "https://plus.unsplash.com/premium_photo-1667030474693-6d0632f97029?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      "https://plus.unsplash.com/premium_photo-1667099521469-df09eb52c812?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      "https://images.unsplash.com/photo-1570018143038-6f4c428f6e3e?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const [showPostModal, setShowPostModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>("");
  const [posterName, setPosterName] = useState<string>("");

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
              if (newImages.length === files.length) {
                setUploadedImages((prev) => [...prev, ...newImages]);
              }
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenModal = () => {
    setShowPostModal(true);
    setUploadedImages([]);
    setSelectedAnimalType("");
    setPosterName("");
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setUploadedImages([]);
    setSelectedAnimalType("");
    setPosterName("");
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredAnimals.map((animal) => (
        <div
          key={animal.id}
          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group border border-gray-100"
        >
          <div className="relative">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-2 rounded-full text-sm font-bold border backdrop-blur-sm ${getUrgencyColor(
                  animal.urgency
                )}`}
              >
                {animal.urgency} priority
              </span>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium">
              <Camera className="w-4 h-4 inline mr-1" />
              {animal.postedTime}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {animal.name}
              </h3>
              <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
                {animal.type}
              </span>
            </div>

            <div className="flex items-center text-indigo-600 mb-3">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">{animal.location}</span>
            </div>

            <div className="flex items-center text-gray-500 mb-4">
              <span className="text-sm font-medium">
                {animal.distance} away
              </span>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                {getConditionIcon(animal.condition)}
                <span className="text-sm ml-1 font-medium">
                  {animal.condition}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
              {animal.info}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
              <span className="font-medium">
                {animal.age} • {animal.gender}
              </span>
              <span className="flex items-center">
                {animal.vaccinated && (
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                    Vaccinated
                  </span>
                )}
              </span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group shadow-lg">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Rescue Now
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 transition-colors shadow-sm">
                <Phone className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              Posted by{" "}
              <span className="font-semibold text-gray-700">
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
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group"
        >
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
                  )}`}
                >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-6 mb-6">
            <h1 className="text-5xl font-bold text-gray-900">
              Animals Nearby Need Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Help
              </span>
            </h1>
            <button
              onClick={handleOpenModal}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post Animal
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with stray animals in your area and make a difference in
            their lives
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-12 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border-2 border-indigo-200 rounded-2xl px-6 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="all">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="cow">Cows</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>All Urgency</option>
                  <option>High Priority</option>
                  <option>Medium Priority</option>
                  <option>Low Priority</option>
                </select>
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>All Conditions</option>
                  <option>Good</option>
                  <option>Injured</option>
                  <option>Pregnant</option>
                </select>
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
                  <option>Any Distance</option>
                  <option>Under 1km</option>
                  <option>Under 5km</option>
                  <option>Under 10km</option>
                </select>
                <select className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm">
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
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 text-lg">
            Showing{" "}
            <span className="font-bold text-indigo-600">
              {filteredAnimals.length}
            </span>{" "}
            animals near you
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl">
            <span>Last updated: 1 Day ago</span>
          </div>
        </div>

        {/* Listings */}
        {viewMode === "grid" ? <GridView /> : <ListView />}

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-indigo-200 px-10 py-4 rounded-2xl font-bold hover:bg-white hover:border-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Animals
          </button>
        </div>

        {/* Post Animal Modal */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Post a Stray Animal
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                {/* Animal Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Animal Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Dog", "Cat", "Cow"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedAnimalType(type)}
                        className={`p-4 border-2 rounded-2xl transition-all text-center font-medium ${
                          selectedAnimalType === type
                            ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {type === "Dog" && "🐕"}
                        {type === "Cat" && "🐱"}
                        {type === "Cow" && "🐄"}
                        <div className="mt-2">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animal Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Animal Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Buddy, Luna..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Location Where Found *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Near MG Road Metro Station, Bengaluru or Sector 12, Noida"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please be as specific as possible to help rescuers find the
                    animal
                  </p>
                </div>

                {/* Animal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Age (Estimated)
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors">
                      <option value="">Select age</option>
                      <option value="Young (0-1 year)">Young (0-1 year)</option>
                      <option value="Adult (1-7 years)">
                        Adult (1-7 years)
                      </option>
                      <option value="Senior (7+ years)">
                        Senior (7+ years)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender (Optional)
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors">
                      <option value="">Select if known</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                </div>

                {/* Condition & Urgency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="Good">Good</option>
                      <option value="Injured">Injured</option>
                      <option value="Sick">Sick</option>
                      <option value="Pregnant">Pregnant</option>
                      <option value="Malnourished">Malnourished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Urgency *
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select urgency</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe the animal's condition, behavior, and any immediate needs..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload Photos
                  </label>

                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload photos</p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG up to 10MB each
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Preview Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Uploaded Photos ({uploadedImages.length})
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Contact Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Poster Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Priya Singh"
                    value={posterName}
                    onChange={(e) => setPosterName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be shown as "Posted by [Your Name]" on the listing
                  </p>
                </div>

                {/* Vaccination Status */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Animal appears to be vaccinated (if known)
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    Post Animal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartRescuingPage;
