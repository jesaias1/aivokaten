'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  created_at: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

// Pre-seeded admin account
const ADMIN_ACCOUNTS: Record<string, { password: string; id: string; created_at: string; role: 'admin' }> = {
  'lin4s@live.dk': {
    password: 'miebs112',
    id: 'admin-001',
    created_at: '2026-03-11T00:00:00.000Z',
    role: 'admin',
  },
}

interface StoredUser {
  password: string
  id: string
  created_at: string
  role?: 'user' | 'admin'
}

function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('aivokaten-users') || '{}')
  } catch {
    return {}
  }
}

function saveStoredUsers(users: Record<string, StoredUser>) {
  localStorage.setItem('aivokaten-users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const session = localStorage.getItem('aivokaten-session')
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch {
        localStorage.removeItem('aivokaten-session')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Check admin accounts first
    const admin = ADMIN_ACCOUNTS[email]
    if (admin) {
      if (admin.password !== password) {
        throw new Error('Forkert adgangskode')
      }
      const userData: User = { id: admin.id, email, created_at: admin.created_at, role: 'admin' }
      localStorage.setItem('aivokaten-session', JSON.stringify(userData))
      setUser(userData)
      return
    }

    // Check regular users
    const users = getStoredUsers()
    const stored = users[email]
    if (!stored) {
      throw new Error('Ingen konto fundet med denne email')
    }
    if (stored.password !== password) {
      throw new Error('Forkert adgangskode')
    }
    const userData: User = { id: stored.id, email, created_at: stored.created_at, role: stored.role || 'user' }
    localStorage.setItem('aivokaten-session', JSON.stringify(userData))
    setUser(userData)
  }

  const signUp = async (email: string, password: string) => {
    // Block signup for admin emails
    if (ADMIN_ACCOUNTS[email]) {
      throw new Error('Denne email er reserveret')
    }
    const users = getStoredUsers()
    if (users[email]) {
      throw new Error('Der findes allerede en konto med denne email')
    }
    const id = crypto.randomUUID()
    const created_at = new Date().toISOString()
    users[email] = { password, id, created_at, role: 'user' }
    saveStoredUsers(users)
    const userData: User = { id, email, created_at, role: 'user' }
    localStorage.setItem('aivokaten-session', JSON.stringify(userData))
    setUser(userData)
  }

  const signOut = async () => {
    localStorage.removeItem('aivokaten-session')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
