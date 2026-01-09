import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Bharakt</span>
            </Link>
            <p className="text-gray-600 max-w-md">
              Connecting blood donors with those in need. Every drop counts in saving lives.
              Join our mission to make blood donation accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-red-600 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-red-600 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-red-600 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>support@bharakt.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Emergency: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bharakt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
