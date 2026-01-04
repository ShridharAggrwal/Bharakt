import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import ScrollReveal from '../components/common/ScrollReveal'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('') // Clear previous errors

    try {
      const user = await login(formData.email, formData.password, formData.role)

      // Navigation happens after successful login
      switch (user.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'ngo':
          navigate('/ngo')
          break
        case 'blood_bank':
          navigate('/blood-bank')
          break
        default:
          navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  const roles = [
    { value: 'user', label: 'Donor/User' },
    { value: 'admin', label: 'Admin' },
    { value: 'ngo', label: 'NGO' },
    { value: 'blood_bank', label: 'Blood Bank' }
  ]

  return (
    <div className="min-h-screen gradient-bg-hero">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl opacity-40 animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-md relative">
          <ScrollReveal animation="scale-in">
            <div className="form-card shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30 animate-float">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
                <p className="text-gray-600 mt-2">Sign in to your account</p>
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Login as</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${formData.role === role.value
                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 border-transparent text-white shadow-lg shadow-pink-500/30'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50/50'
                          }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="gradient-text hover:opacity-80 font-semibold transition-opacity">
                  Register here
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}

export default Login
