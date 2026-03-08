import { useNavigate } from 'react-router-dom';
import { HOUSE_COLORS } from '../utils/constants';

const LandingPage = () => {
  const navigate = useNavigate();

  const houses = [
    {
      name: 'Prudhvi',
      image: '/prudhvi1-logo.jpeg',
      gradient: 'from-green-500/80 to-green-900/90',
    },
    {
      name: 'Agni',
      image: '/agni-logo.png',
      gradient: 'from-red-500/80 to-red-900/90',
    },
    {
      name: 'Jal',
      image: '/jal-logo.png',
      gradient: 'from-blue-500/80 to-blue-900/90',
    },
    {
      name: 'Akash',
      image: '/akash-logo.png',
      gradient: 'from-amber-500/80 to-amber-900/90',
    },
    {
      name: 'Vayu',
      image: '/vayu-tornado.jpg',
      gradient: 'from-purple-500/80 to-purple-900/90',
    },
  ];

  const innovations = [
    {
      title: 'AI Projects',
      description: 'Cutting-edge artificial intelligence research and development initiatives.',
      icon: '🤖',
    },
    {
      title: 'Hackathons',
      description: 'Competitive coding events fostering creativity and problem-solving skills.',
      icon: '💻',
    },
    {
      title: 'Research Labs',
      description: 'State-of-the-art facilities for advanced computer science research.',
      icon: '🔬',
    },
    {
      title: 'Innovation Clubs',
      description: 'Student-led communities driving technological innovation and collaboration.',
      icon: '🚀',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            House System
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Home
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Glass Container */}
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-12 md:p-16">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Department of Computer Science and Design
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Fostering innovation, creativity, and excellence through collaborative student activities and inter-house competitions
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>Explore Houses</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Houses Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Five Houses of Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each house represents unique values and fosters a spirit of healthy competition and camaraderie
            </p>
          </div>

          {/* Houses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {houses.map((house) => (
              <div
                key={house.name}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${house.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${house.gradient} opacity-90`} />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* House Name */}
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {house.name}
                    </h3>
                  </div>

                  {/* Get Started Button */}
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 transition-all duration-300 hover:border-white/50"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Startups & Innovations Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Startups & Innovations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empowering students to transform ideas into reality through cutting-edge technology and entrepreneurial thinking
            </p>
          </div>

          {/* Innovation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((item, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/60 rounded-2xl p-8 shadow-lg hover:shadow-xl border border-white/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Department Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                Department of Computer Science and Design
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Building tomorrow's innovators through excellence in education and research
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-xl">💼</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Department of Computer Science and Design. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
