'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/chat')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Der opstod en fejl'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-navy-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold">
            Ai
          </div>
          <span className="text-2xl font-bold tracking-tight">Aivokaten</span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Log ind' : 'Opret konto'}
          </h1>
          <p className="text-navy-400 text-sm text-center mb-6">
            {isLogin
              ? 'Log ind for at bruge din AI-juridiske assistent'
              : 'Opret en gratis konto for at komme i gang'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.dk"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-navy-900/60 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/30 transition-all text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-300 mb-1.5">
                Adgangskode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-900/60 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/30 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold-400 to-gold-300 text-navy-950 font-semibold text-sm hover:shadow-lg hover:shadow-gold-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Vent venligst...
                </span>
              ) : isLogin ? (
                'Log ind'
              ) : (
                'Opret konto'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-sm text-navy-400 hover:text-gold-300 transition-colors"
            >
              {isLogin
                ? 'Har du ikke en konto? Opret konto'
                : 'Har du allerede en konto? Log ind'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
