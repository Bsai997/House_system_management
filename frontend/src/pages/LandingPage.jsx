
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOUSE_COLORS, HOUSE_LOGOS } from '../utils/constants';

// ── Image Carousel Component ──
const trainImages = [
  '/bhm-online.png',
  '/campus.png',
  '/nutri.png',
  '/smart.png',
  '/lunchbox.png',
];

function ImageTrain() {
  // Duplicate images for seamless loop
  const images = [...trainImages, ...trainImages];
  const trackRef = useRef(null);

  // Responsive image width
  const imgWidth = 320; // px, increased for better visibility
  const gap = 40; // px, slightly increased for spacing
  const totalImages = images.length;
  const trackWidth = totalImages * imgWidth + (totalImages - 1) * gap;

  return (
    <div className="w-full flex justify-center items-center mb-8 overflow-x-hidden">
      <div
        ref={trackRef}
        className="relative flex items-center animate-train-slide"
        style={{ width: trackWidth, minHeight: 160, gap: `${gap}px` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`train-img-${idx}`}
            className="object-contain select-none drop-shadow-md rounded-xl bg-white border border-blue-100"
            style={{ width: imgWidth, height: 200, backgroundColor: '#fff' }}
            draggable={false}
          />
        ))}
      </div>
      <style>{`
        @keyframes train-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(trainImages.length * (imgWidth + gap))}px); }
        }
        .animate-train-slide {
          animation: train-slide 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

const houses = Object.entries(HOUSE_COLORS).map(([name, colors]) => ({
  name,
  primary: colors.primary,
  dark: colors.dark,
  logo: HOUSE_LOGOS[name],
}));

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50/60 via-white to-white text-gray-800">
      {/* ── Subtle background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-150 h-150 rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-125 h-125 rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      {/* ── Hero Card ── */}
      <section className="relative z-20 w-full bg-white pt-4 pb-4">
        <div className="flex justify-center items-center">
          <nav className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <img src="/srkrec.png" alt="SRKREC Logo" className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-purple-200" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-400 tracking-wide mb-1">SRKREC</span>
                <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-black">CSD & CSIT Department</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-full font-semibold text-base text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7)' }}
            >
              Home
            </button>
          </nav>
        </div>
      </section>

      {/* ── Divider below hero section ── */}
      <div className="relative z-10 w-full">
        <hr className="border-t border-gray-200" />
      </div>

      {/* ── CSD & CSIT Dept Card Section ── */}
      <section className="relative z-10 flex justify-center items-center pt-10 pb-20 bg-transparent">
        <div className="bg-white/95 rounded-2xl shadow-xl border border-purple-100/60 px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 text-center animate-floating w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto" style={{ animation: 'floatOnWater 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent mx-auto" style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7, #ec4899)' }}>CSD and CSIT Department</h1>
          <p className="mt-8 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Empowering students to unlock their creative potential, drive innovation and seize new opportunities for growth and success.
          </p>
          <div className="mt-10 flex justify-center">
            <button
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7)' }}
              onClick={() => {
                const aboutSection = document.getElementById('about-dept-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              About Dept
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── About Our Dept Section ── */}

      {/* ── Divider ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <hr className="border-t border-black/20" />
      </div>


      {/* ── About Our Dept Section ── */}
      <section id="about-dept-section" className="relative z-10 w-full px-6 pt-10 pb-20" style={{ perspective: '1200px', marginLeft: 0 }}>
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-200/40 border border-purple-100/60 px-10 sm:px-20 py-12 sm:py-16 text-center md:text-left w-full max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black mb-2 bg-clip-text text-transparent tracking-tight text-center" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }}>About Our Dept</h2>
          <p className="mt-8 text-lg sm:text-xl text-gray-500 max-w-4xl mx-auto text-center leading-relaxed">
            Our department strongly believes that education should go beyond textbooks and classrooms. The department provides an environment where students can explore their ideas, develop technical skills, and transform their knowledge into real-world solutions. To support student activities and improve participation, the department also encourages the development of innovative platforms like the House System, which improves student personality.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 rounded-full font-semibold text-base text-white bg-linear-to-r from-purple-500 to-pink-500 shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/explore')}
            >
              Explore Houses
            </button>
            <button
              className="px-8 py-3 rounded-full font-semibold text-base text-white bg-linear-to-r from-blue-500 to-green-500 shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => {
                const startupSection = document.getElementById('startup-environment-section');
                if (startupSection) {
                  startupSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Startups
            </button>
          </div>
        </div>
      </section>

      {/* ── Startup Environment Section ── */}
      <section id="startup-environment-section" className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4" style={{ backgroundImage: 'linear-gradient(135deg, #2563eb, #22d3ee, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Startup Environment</h2>
          <p className="text-gray-500 text-lg mt-2 max-w-2xl mx-auto">Discover a thriving startup ecosystem that encourages innovation, collaboration, and entrepreneurship among students. Our environment provides resources, mentorship, and opportunities to turn ideas into impactful ventures.</p>
        </div>
        {/* ── Image Train Below Startup Environment ── */}
        <ImageTrain />
      </section>

      {/* ── Houses Section ── */}
      <section id="houses" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Five Houses of Excellence
          </h2>
          <p className="text-gray-400 text-lg mt-2 max-w-xl mx-auto">Each house represents unique values and fosters a spirit of healthy competition and camaraderie</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {houses.map((house) => (
            <div
              key={house.name}
              className="group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              style={{ background: `linear-gradient(180deg, ${house.primary}, ${house.dark})`, minHeight: '280px' }}
              onClick={() => navigate('/login')}
            >
              {/* House name */}
              <div className="relative z-10 p-4">
                <h3 className="text-lg font-bold text-white">{house.name}</h3>
              </div>

              {/* House logo - full card background */}
              <div className="absolute inset-0">
                <img src={house.logo} alt={house.name} className="w-full h-full object-cover" />
              </div>
              {/* Overlay for readability */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${house.primary}cc 0%, ${house.dark}99 100%)` }} />

              {/* Get Started button at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/90 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🏆', title: 'Compete & Earn', desc: 'Participate in events and earn points for your house.' },
            { icon: '📊', title: 'Live Leaderboard', desc: 'Real-time standings and rankings across all houses.' },
            { icon: '🤝', title: 'Team Spirit', desc: 'Collaborate with housemates and lead together.' },
          ].map((feat, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg shadow-purple-200/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-300/50"
            >
              {/* Icon removed as requested */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div
          className="relative rounded-3xl overflow-hidden px-8 sm:px-14 py-14 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7)' }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1), transparent 50%)' }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to represent?</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Join your house, participate in events, and make your mark on the leaderboard.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-full font-bold text-base bg-white text-purple-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gray-100 pt-12 pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-700">
          {/* College Info */}
          <div>
            <h3 className="text-2xl font-extrabold mb-1 text-gray-900">SRKR Engineering College</h3>
            <span className="block text-blue-600 font-medium mb-4">Excellence in Technical Education</span>
            <p className="mb-6 text-base text-gray-500">Official portal for CSD & CSIT departments. Track house leaderBoard, manage house events, and view house points.</p>
            <a href="https://srkrec.edu.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-blue-700 font-semibold shadow-sm hover:bg-blue-100 transition mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0 0L10 21l-7-7 11-11z" /></svg>
              Visit Main Website
            </a>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 text-gray-900 tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><a href="#houses" className="hover:underline font-medium text-gray-700">Houses</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Events</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Attendance</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Faculty</a></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h4 className="font-bold mb-3 text-gray-900 tracking-wide">RESOURCES</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline font-medium text-gray-700">Departments</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Admissions</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Placements</a></li>
              <li><a href="#" className="hover:underline font-medium text-gray-700">Contact</a></li>
            </ul>
          </div>
          {/* Get in Touch */}
          <div>
            <h4 className="font-bold mb-3 text-gray-900 tracking-wide">GET IN TOUCH</h4>
            <ul className="space-y-2 text-gray-500 text-base">
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg><span className="text-blue-500"></span> Bhimavaram, Andhra Pradesh, India</li>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-280q-33 0-56.5-23.5T200-360v-400q0-33 23.5-56.5T280-840h560q33 0 56.5 23.5T920-760v400q0 33-23.5 56.5T840-280H280Zm280-188L280-663v303h560v-303L560-468Zm0-98 280-194H280l280 194ZM120-120q-33 0-56.5-23.5T40-200v-500h80v500h660v80H120Zm720-546v-94H280v94-94h560v94Z"/></svg> principal@srkrec.ac.in</li>
              <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>+91 (8816) 223332</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://www.facebook.com/SRKRECOFFICIAL" className="bg-blue-100 rounded-lg p-2 hover:bg-blue-200"><svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg></a>
              <a href="https://www.instagram.com/srkr_engineering_college" target='_blank' className="bg-red-100 rounded-lg p-2 hover:bg-red-200"><svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344 2.697 2.325 2.465 3.437 2.406 4.718 2.347 5.998 2.334 6.407 2.334 12c0 5.593.013 6.002.072 7.282.059 1.281.291 2.393 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.28.072-1.689.072-7.282 0-5.593-.013-6.002-.072-7.282-.059-1.281-.291-2.393-1.272-3.374C19.341.363 18.229.131 16.948.072 15.668.013 15.259 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.324A4.162 4.162 0 1 1 16.162 12 4.162 4.162 0 0 1 12 16.162zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg></a>
              <a href="https://x.com/SRKR_EC" className="bg-green-100 rounded-lg p-2 hover:bg-green-200"><svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184A4.916 4.916 0 0 0 16.616 3c-2.717 0-4.92 2.206-4.92 4.924 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 1.997 1.397 3.872 3.448 4.29a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.009-7.514 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z"/></svg></a>
              <a href="https://www.youtube.com/channel/UCW7vjllBR9k_zSAYBzh9Iiw" target='_blank' className="bg-orange-100 rounded-lg p-2 hover:bg-orange-200"><svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.197 3.5 12 3.5 12 3.5s-7.197 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.374 0 12 0 12s0 3.626.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.803 20.5 12 20.5 12 20.5s7.197 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.626 24 12 24 12s0-3.626-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
        </div>
        {/* Back to top button */}
        <div className="flex justify-center mt-10">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          </button>
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">© 2024 SRKR Engineering College. All rights reserved.</div>
      </footer>

      {/* Animation keyframes */}
      <style>{`
        @keyframes floatOnWater {
          0% {
            transform: rotateX(0deg) rotateY(0deg) translateY(0px);
            box-shadow: 0 25px 50px -12px rgba(168, 85,247, 0.25);
          }
          25% {
            transform: rotateX(1.5deg) rotateY(-1deg) translateY(-6px);
            box-shadow: 0 30px 60px -15px rgba(168, 85,247, 0.3);
          }
          50% {
            transform: rotateX(-1deg) rotateY(1.5deg) translateY(-3px);
            box-shadow: 0 20px 40px -10px rgba(168, 85,247, 0.2);
          }
          75% {
            transform: rotateX(0.5deg) rotateY(-0.5deg) translateY(-8px);
            box-shadow: 0 35px 65px -15px rgba(168, 85,247, 0.35);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg) translateY(0px);
            box-shadow: 0 25px 50px -12px rgba(168, 85,247, 0.25);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
