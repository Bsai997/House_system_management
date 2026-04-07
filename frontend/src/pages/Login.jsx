import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register, getAllHouses, setTabToken } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    houseId: '',
    regdNo: '',
    year: '',
    department: '',
  });

  // ── Transition state ──────────────────────────────────────────────────────
  // `animKey` changes on every toggle so React remounts the animated div,
  // restarting the CSS animation from scratch each time.
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState('right');
  // 'right' → coming from right  (Login → Register)
  // 'left'  → coming from left   (Register → Login)
  // ─────────────────────────────────────────────────────────────────────────

  const { loginUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user, navigate]);

  useEffect(() => {
    if (!isLogin) {
      getAllHouses()
        .then((res) => setHouses(res.data.houses))
        .catch(() => { });
    }
  }, [isLogin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login({ email: form.email, password: form.password });
      } else {
        const payload = { ...form };
        if (!payload.houseId) delete payload.houseId;
        if (!payload.year) delete payload.year;
        res = await register(payload);
      }

      setTabToken(res.data.token);
      loginUser(res.data.user);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchTo = (toLogin) => {
    if (toLogin === isLogin) return;
    setDirection(toLogin ? 'left' : 'right');
    setAnimKey((k) => k + 1);
    setIsLogin(toLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-white to-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-purple-700 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 border border-purple-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center overflow-hidden mb-4 shadow-md border-2 border-purple-100">
            <img src="/dept-logo.png" alt="Department Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            CSD &amp; CSIT Department
          </h1>
          <p className="text-base text-gray-500">House Portal</p>
        </div>

        {/* Card */}
        <div className="flex flex-col items-center">
          {/* User avatar overlapping the card */}
          <div
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center z-20 shadow-lg border-4 border-white relative"
            style={{ marginBottom: '-2.5rem', marginTop: '0.5rem' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" fill="none" />
              <path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div
            className="bg-white rounded-2xl shadow-xl border border-purple-100/60 p-8 pt-16 w-full z-10"
            style={{ overflow: 'hidden' }}
          >
            {/* Toggle tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => switchTo(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${isLogin ? 'bg-white shadow text-purple-700' : 'text-gray-500'
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchTo(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${!isLogin ? 'bg-white shadow text-purple-700' : 'text-gray-500'
                  }`}
              >
                Register
              </button>
            </div>

            {/* Animated form wrapper — key re-mounts on toggle to retrigger animation */}
            <div
              key={animKey}
              className={direction === 'right' ? 'form-slide-in-right' : 'form-slide-in-left'}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field"
                  required
                  minLength={6}
                />

                {!isLogin && (
                  <>
                    <select
                      name="houseId"
                      value={form.houseId}
                      onChange={handleChange}
                      className="select-field"
                      required
                    >
                      <option value="">Select House</option>
                      {houses.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="regdNo"
                      placeholder="Registration Number"
                      value={form.regdNo}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />

                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="select-field"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>

                    <input
                      type="text"
                      name="department"
                      placeholder="Department (e.g., CSD, CSIT)"
                      value={form.department}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold text-lg text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </span>
                  ) : isLogin ? (
                    'Login'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
