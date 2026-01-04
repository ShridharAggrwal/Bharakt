import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollReveal from '../components/common/ScrollReveal'
import api from '../services/api'

const Home = () => {
  const [stats, setStats] = useState({
    activeDonors: 0,
    bloodBanks: 0,
    ngos: 0,
    livesSaved: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats')
        setStats(response.data)
      } catch (error) {
        console.log('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Active Donors', value: stats.activeDonors, icon: '👥', color: 'bg-gradient-to-br from-rose-50 to-pink-50 text-rose-600' },
    { label: 'Blood Banks', value: stats.bloodBanks, icon: '🏥', color: 'bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-600' },
    { label: 'NGOs', value: stats.ngos, icon: '🤝', color: 'bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600' },
    { label: 'Lives Saved', value: stats.livesSaved, icon: '❤️', color: 'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden gradient-bg-hero">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-scale-in border border-rose-100">
              <span className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"></span>
              Saving lives, one donation at a time
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 animate-fade-in">
              Save Lives,{' '}
              <span className="gradient-text">Donate Blood</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Connect with blood donors and recipients in your area.
              Every donation makes a difference. Join our community of lifesavers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Become a Donor
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Request Blood
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {statCards.map((stat, index) => (
              <ScrollReveal key={stat.label} animation="slide-up" delay={index * 100}>
                <div className="gradient-bg-card border-0 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${stat.color} flex items-center justify-center text-2xl shadow-md`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              How BloodLink Works
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-in" delay={100}>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Our platform connects those in need with willing donors through a simple, efficient process
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register',
                description: 'Create your account and fill in your blood group and location details.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Request or Donate',
                description: 'Request blood when needed or respond to alerts from nearby requests.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Save Lives',
                description: 'Connect with donors within 35km and help save lives together.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <ScrollReveal key={feature.step} animation="slide-up" delay={index * 150}>
                <div className="card relative group hover:border-rose-200">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {feature.step}
                  </div>
                  <div className="pt-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 gradient-bg-soft">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="slide-in-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  About <span className="gradient-text">BloodLink</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  BloodLink is a platform dedicated to connecting blood donors with those in need.
                  We believe that every person deserves access to safe blood when they need it most.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our mission is to bridge the gap between blood donors and recipients through
                  technology, making the process of blood donation and request seamless and efficient.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Real-time Alerts', desc: 'Instant notifications' },
                    { label: '35km Radius', desc: 'Location-based matching' },
                    { label: 'Verified Donors', desc: 'Safe & trustworthy' },
                    { label: '24/7 Available', desc: 'Always ready to help' }
                  ].map((item, index) => (
                    <ScrollReveal key={item.label} animation="slide-in-left" delay={index * 100}>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.desc}</div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-transparent rounded-3xl blur-2xl opacity-60 animate-gradient-shift" />
                <div className="relative gradient-bg-card border-0 rounded-3xl p-8 shadow-2xl">
                  <div className="text-6xl mb-6">🩸</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Join Our Community</h3>
                  <p className="text-gray-600 mb-6">
                    Be part of a network that saves lives every day. Register now and make a difference.
                  </p>
                  <Link to="/register" className="btn-primary inline-block">
                    Get Started
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              Blood Types We Support
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-in" delay={100}>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              All blood types are needed. Find out which type you can donate and receive.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type, index) => (
              <ScrollReveal key={type} animation="scale-in" delay={index * 80}>
                <div className="gradient-bg-card border-0 text-center py-6 hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl hover:-translate-y-1">
                  <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">{type}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="scale-in">
            <div className="max-w-16xl mx-auto">
              <div className="relative group">
                {/* Animated gradient glow background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 animate-gradient-shift transition duration-1000"></div>

                {/* Main card */}
                <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-pink-600 rounded-3xl p-10 md:p-12 shadow-2xl text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-float">
                      <span className="text-4xl">❤️</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                      Ready to Make a Difference?
                    </h2>

                    <p className="text-pink-50 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                      Join thousands of donors who are saving lives every day. Your donation matters.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/register" className="bg-white text-rose-600 hover:bg-gray-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 text-lg hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                        Register Now
                      </Link>
                      <Link to="/login" className="bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-10 rounded-xl border-2 border-white/50 hover:border-white transition-all duration-300 text-lg hover:scale-105 hover:-translate-y-1">
                        Already a Member?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
