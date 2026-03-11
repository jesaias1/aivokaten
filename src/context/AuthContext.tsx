'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

function getStoredUsers(): Record<string, { password: string; id: string; created_at: string }> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('aivokaten-users') || '{}')
  } catch {
    return {}
  }
}

function saveStoredUsers(users: Record<string, { password: string; id: string; created_at: string }>) {
  localStorage.setItem('aivokaten-users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
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
    const users = getStoredUsers()
    const stored = users[email]
    if (!stored) {
      throw new Error('Ingen konto fundet med denne email')
    }
    if (stored.password !== password) {
      throw new Error('Forkert adgangskode')
    }
    const userData: User = { id: stored.id, email, created_at: stored.created_at }
    localStorage.setItem('aivokaten-session', JSON.stringify(userData))
    setUser(userData)
  }

  const signUp = async (email: string, password: string) => {
    const users = getStoredUsers()
    if (users[email]) {
      throw new Error('Der findes allerede en konto med denne email')
    }
    const id = crypto.randomUUID()
    const created_at = new Date().toISOString()
    users[email] = { password, id, created_at }
    saveStoredUsers(users)
    const userData: User = { id, email, created_at }
    localStorage.setItem('aivokaten-session', JSON.stringify(userData))
    setUser(userData)
  }

  const signOut = async () => {
    localStorage.removeItem('aivokaten-session')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
