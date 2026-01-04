import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import ScrollReveal from '../components/common/ScrollReveal'
import { useGeolocation } from '../hooks/useGeolocation'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    blood_group: '',
    address: '',
    latitude: '',
    longitude: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const geolocation = useGeolocation()

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleGetLocation = () => {
    geolocation.getCurrentLocation()
  }

  // Update form when geolocation changes
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      setFormData(prev => ({
        ...prev,
        latitude: geolocation.latitude.toString(),
        longitude: geolocation.longitude.toString()
      }))
    }
  }, [geolocation.latitude, geolocation.longitude])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Don't clear errors immediately - let user see them
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('') // Clear previous errors
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setLoading(false)
      setTimeout(() => {
        setError('Passwords do not match')
      }, 10)
      return
    }

    if (formData.password.length < 6) {
      setLoading(false)
      setTimeout(() => {
        setError('Password must be at least 6 characters')
      }, 10)
      return
    }

    if (!formData.latitude || !formData.longitude) {
      setLoading(false)
      setTimeout(() => {
        setError('Location is required. Please allow location access or enter coordinates manually.')
      }, 10)
      return
    }

    try {
      const { confirmPassword, ...dataToSend } = formData
      await register(dataToSend)
      setLoading(false)
      setSuccess('Registration successful! Please check your email to verify your account.')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.'
      setLoading(false)
      setTimeout(() => {
        setError(errorMessage)
      }, 10)
    }
  }

  return (
    <div className="min-h-screen gradient-bg-hero">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl opacity-40 animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="w-full max-w-lg relative">
          <ScrollReveal animation="scale-in">
            <div className="form-card shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30 animate-float">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
                <p className="text-gray-600 mt-2">Join BloodLink as a donor</p>
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 animate-slide-up">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Gender & Blood Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select
                      name="blood_group"
                      value={formData.blood_group}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Enter your full address"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Required for blood request matching)
                  </label>

                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={geolocation.loading}
                    className="w-full mb-3 py-2.5 px-4 bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 text-sky-700 border border-sky-200 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
                  >
                    {geolocation.loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Getting location...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Get My Location
                      </>
                    )}
                  </button>

                  {geolocation.error && (
                    <div className="text-sm text-amber-600 mb-2 p-2 bg-amber-50 rounded-lg">
                      {geolocation.error}. Please enter coordinates manually below.
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="input-field text-sm"
                        placeholder="e.g., 12.9716"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="input-field text-sm"
                        placeholder="e.g., 77.5946"
                        required
                      />
                    </div>
                  </div>

                  {formData.latitude && formData.longitude && (
                    <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Location set: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                    </div>
                  )}
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
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
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="gradient-text hover:opacity-80 font-semibold transition-opacity">
                  Sign in
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}

export default Register
