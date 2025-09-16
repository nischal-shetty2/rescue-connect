import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('currentUser')
  const user = isLoggedIn
    ? JSON.parse(localStorage.getItem('currentUser') || '{}')
    : null

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-md">
      <Link
        to="/"
        className="text-2xl font-extrabold text-blue-600 tracking-tight"
      >
        RescueConnect
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/adopt"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Adopt
        </Link>
        <Link
          to="/disease"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Detect Disease
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm font-medium">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
