import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register, getAllHouses } from '../services/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

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

  const { loginUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!isLogin) {
      getAllHouses()
        .then((res) => setHouses(res.data.houses))
        .catch(() => {});
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

      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}!`);

      const role = res.data.user.role;
      navigate(`/${role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center text-4xl mb-4">
            🏛️
          </div>
          <h1 className="text-3xl font-bold text-white">House Event Management</h1>
          <p className="text-white/70 mt-2">CSD & CSIT Department</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                !isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'
              }`}
            >
              Register
            </button>
          </div>

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
                  className="input-field"
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
                  className="input-field"
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
              className="w-full btn-primary py-3 disabled:opacity-50"
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
  );
};

export default Login;
