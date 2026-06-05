import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    return response.data
  }

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth }
