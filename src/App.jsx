import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import CandidateDashboard from './pages/CandidateDashboard'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'
import CodingArena from './components/CodingArena'

function App() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const isAuthRoute = ['/login', '/register'].includes(location.pathname)

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
          <span className="loading-spinner" />
          <span className="font-semibold">Loading RecruitFlow...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={isAuthRoute ? 'min-h-screen bg-slate-950 text-white' : 'app-shell min-h-screen text-slate-100'}>
      {/* Navbar only shown when logged in or on non-auth public pages */}
      {!isAuthRoute && <Navbar />}

      <main className={isAuthRoute ? '' : 'mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8'}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/feed" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/feed" replace />} />
          <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" replace />} />
          <Route
            path="/candidate"
            element={user?.role === 'candidate' ? <CandidateDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={
              user?.role && ['admin', 'hr', 'tech'].includes(user.role) ? (
                <AdminPanel />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          <Route
            path="/coding"
            element={user?.role === 'candidate' ? <CodingArena /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to={user ? '/feed' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
