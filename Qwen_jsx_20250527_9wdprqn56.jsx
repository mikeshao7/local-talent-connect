import React, { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [talentTitle, setTalentTitle] = useState('');
  const [talentDescription, setTalentDescription] = useState('');
  const [talentPostcode, setTalentPostcode] = useState('');
  const [priceRangeMin, setPriceRangeMin] = useState('');
  const [priceRangeMax, setPriceRangeMax] = useState('');
  const [isFixedPrice, setIsFixedPrice] = useState(false);

  // Simulated NSW Metro area postcodes with coordinates
  const postcodeCoordinates = {
    '2000': { lat: -33.8688, lng: 151.2093 },
    '2021': { lat: -33.8733, lng: 151.2152 },
    '2032': { lat: -33.8487, lng: 151.2192 },
    '2040': { lat: -33.8522, lng: 151.2152 },
    '2064': { lat: -33.8137, lng: 151.2002 },
    '2135': { lat: -33.8922, lng: 151.1084 },
    '2150': { lat: -33.8690, lng: 151.0000 },
    '2220': { lat: -34.0522, lng: 151.1837 },
    '2500': { lat: -34.9011, lng: 150.8826 },
  };

  // Mock talents
  const [talents, setTalents] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Piano Instructor",
      description: "Experienced piano teacher with over 10 years of teaching children and adults.",
      category: "Music",
      location: "Surry Hills, NSW 2010",
      lat: -33.8748,
      lng: 151.2153,
      rating: 9.4,
      totalMatches: 12,
    },
    {
      id: 2,
      name: "James Wilson",
      title: "Math Tutor",
      description: "Certified math tutor offering help in Algebra, Geometry, and Calculus for K-12 students.",
      category: "Education",
      location: "Paddington, NSW 2021",
      lat: -33.8522,
      lng: 151.2152,
      rating: 8.1,
      totalMatches: 7,
    },
    {
      id: 3,
      name: "Maria Garcia",
      title: "Spanish Teacher",
      description: "Native Spanish speaker offering conversational classes for all ages.",
      category: "Language",
      location: "Manly, NSW 2099",
      lat: -33.8137,
      lng: 151.2002,
      rating: 4.7,
      totalMatches: 2,
    },
    {
      id: 4,
      name: "David Kim",
      title: "Guitar Lessons",
      description: "Teach acoustic and electric guitar styles including rock, blues, and classical.",
      category: "Music",
      location: "Ryde, NSW 2112",
      lat: -33.8922,
      lng: 151.1084,
      rating: 9.6,
      totalMatches: 15,
    },
    {
      id: 5,
      name: "Emily Chen",
      title: "Art Classes for Kids",
      description: "Creative art instructor specializing in drawing, painting, and crafts for children.",
      category: "Arts & Crafts",
      location: "Parramatta, NSW 2150",
      lat: -33.8690,
      lng: 151.0000,
      rating: 7.3,
      totalMatches: 5,
    },
    {
      id: 6,
      name: "Robert Smith",
      title: "Yoga Instructor",
      description: "Offering beginner to advanced yoga classes in a peaceful home studio setting.",
      category: "Fitness",
      location: "Wollongong, NSW 2500",
      lat: -34.9011,
      lng: 150.8826,
      rating: 8.8,
      totalMatches: 9,
    },
  ]);

  const categories = ['All', 'Music', 'Education', 'Language', 'Arts & Crafts', 'Fitness'];

  // Haversine formula for distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [userPostcode, setUserPostcode] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState(null);

  const handleSetUserLocation = () => {
    if (!postcodeCoordinates[userPostcode]) {
      setLocationError("Please enter a valid NSW metro postcode.");
      setUserLocation({ lat: null, lng: null });
      return;
    }

    const { lat, lng } = postcodeCoordinates[userPostcode];
    setUserLocation({ lat, lng });
    setLocationError('');
  };

  const filteredTalents = talents.filter(talent => {
    if (!userLocation.lat || !userLocation.lng) return false;

    const matchesSearch = searchQuery === '' ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'All' || talent.category === activeCategory;

    const distance = getDistance(
      userLocation.lat,
      userLocation.lng,
      talent.lat,
      talent.lng
    );
    const withinRadius = distance <= 2;

    return matchesSearch && matchesCategory && withinRadius;
  });

  const handleLoginClick = () => {
    setShowProfilePrompt(true);
  };

  const handleSignInWithGoogle = () => {
    setIsLoggedIn(true);
    setShowProfilePrompt(false);
  };

  const handlePostTalent = (e) => {
    e.preventDefault();
    if (!talentTitle.trim() || !talentDescription.trim() || !talentPostcode.trim()) return;

    setTalents(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: "Demo Poster",
        title: talentTitle,
        description: talentDescription,
        category: "Music",
        location: `NSW ${talentPostcode}`,
        lat: postcodeCoordinates[talentPostcode]?.lat || -33.8688,
        lng: postcodeCoordinates[talentPostcode]?.lng || 151.2093,
        matchedWith: null,
        rating: 0,
        totalMatches: 0
      }
    ]);

    setTalentTitle('');
    setTalentDescription('');
    setTalentPostcode('');
    setPriceRangeMin('');
    setPriceRangeMax('');
    setIsFixedPrice(false);
    setShowPostModal(false);
  };

  const handleContactTalent = (talentId) => {
    setSelectedTalentId(talentId);
    setShowMatchModal(true);
  };

  const confirmMatch = () => {
    const newTalents = talents.map(talent =>
      talent.id === selectedTalentId
        ? { ...talent, matchedWith: 'Anonymous User', totalMatches: talent.totalMatches + 1 }
        : talent
    );
    setTalents(newTalents);
    setShowMatchModal(false);
    alert("✅ Match confirmed! You'll be contacted shortly.");
  };

  const getTalentBadge = (talent) => {
    if (talent.totalMatches >= 10 && talent.rating >= 8.5) {
      return (
        <div className="absolute top-2 right-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l5-5z" clipRule="evenodd" />
            </svg>
            Most Sought After
          </span>
        </div>
      );
    } else if (talent.totalMatches >= 5 && talent.rating >= 8.5) {
      return (
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            Highly Recommended
          </span>
        </div>
      );
    } else if (talent.totalMatches < 5) {
      return (
        <div className="absolute top-2 right-2">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 007.7-5.4C17.7 11.2 16.6 10 15 10H5c-1.6 0-2.7 1.2-2.7 2.6s1.1 2.6 2.7 2.6h10c1.6 0 2.7-1.2 2.7-2.6s-1.1-2.6-2.7-2.6H5z" clipRule="evenodd" />
            </svg>
            New Talent!
          </span>
        </div>
      );
    }
    return null;
  };

  const renderRating = (talent) => {
    const fullStars = Math.floor(talent.rating);
    const halfStar = talent.rating % 1 !== 0;
    const emptyStars = 10 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500">{talent.rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg relative">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">LocalTalentConnect</h1>

          {/* Profile Dropdown / Post Button */}
          {!isLoggedIn ? (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.5 11H17v-2h1.5c.83 0 1.5-.67 1.5-1.5S19.33 8 18.5 8H17V7c0-.55-.45-1-1-1H14v1h-.5c-.83 0-1.5.67-1.5 1.5S13.67 10 14.5 10H16v2h-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H16v1h2v-1h1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H18v-1h1.5z"/>
            </svg>
            Post Your Talent
          </button>
          ) : (
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Post Your Talent
            </button>
          )}
        </div>

        {/* Profile Prompt Modal */}
        {showProfilePrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sign In with Google</h3>
              <p className="text-gray-600 mb-6">Use your Google account to post a talent.</p>
              <button
                onClick={handleSignInWithGoogle}
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg " alt="Google" className="w-5 h-5 mr-2" />
                Sign In with Google
              </button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 pb-6">
          <p className="text-sm text-white/80 mb-4">Find local talents within 2km of your postcode.</p>

          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center mb-4">
            <input
              type="text"
              placeholder="Enter your NSW postcode (e.g., 2000)"
              value={userPostcode}
              onChange={(e) => setUserPostcode(e.target.value)}
              className="w-full sm:w-1/2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
            />
            <button
              onClick={handleSetUserLocation}
              className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Set Location
            </button>
          </div>

          {locationError && (
            <p className="text-red-200 text-center">{locationError}</p>
          )}

          <div className="relative w-full md:w-2/3 lg:w-1/2 mx-auto mt-4">
            <input
              type="text"
              placeholder="Who can... (e.g., teach piano, tutor math, paint portraits)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!userLocation.lat}
              className={`w-full p-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:indigo-500 ${
                !userLocation.lat ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <nav className="mt-4 flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {['All', 'Music', 'Education', 'Language', 'Arts & Crafts', 'Fitness'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-white text-indigo-700 font-medium'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!userLocation.lat ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Set Your Location First</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Please enter a NSW metro postcode above to find talents near you.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredTalents.length} Matching Local Talents (within 2km)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalents.map((talent) => (
                <div
                  key={talent.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  {getTalentBadge(talent)}

                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-800">{talent.title}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {talent.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{talent.description}</p>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {talent.location}
                    </div>

                    {renderRating(talent)}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleContactTalent(talent.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Contact {talent.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTalents.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md p-6">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No talents found nearby</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or entering another postcode.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Post Talent Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Share Your Talent</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePostTalent}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Talent Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={talentTitle}
                  onChange={(e) => setTalentTitle(e.target.value)}
                  placeholder="e.g., Piano Teacher"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={talentDescription}
                  onChange={(e) => setTalentDescription(e.target.value)}
                  placeholder="Tell us about your skill and how you can help others..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Postcode (NSW only)
                </label>
                <input
                  type="text"
                  id="postcode"
                  value={talentPostcode}
                  onChange={(e) => setTalentPostcode(e.target.value)}
                  placeholder="e.g., 2000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Only one location allowed per profile
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post Talent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Match Confirmation Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">We've matched your talent!</h3>
            <p className="text-gray-600 mb-6">
              Would you like to accept this match request? The user will be notified immediately.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMatchModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmMatch}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirm Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">LocalTalentConnect</h2>
              <p className="mt-2 text-gray-400 max-w-xs">
                Connecting local communities through shared skills and knowledge.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LocalTalentConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}