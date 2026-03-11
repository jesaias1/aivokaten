'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function KontoPage() {
  const { user, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gold-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-navy-300">Indlæser...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('da-DK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Ukendt'

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold text-sm">
              Ai
            </div>
            <span className="text-lg font-bold tracking-tight">Aivokaten</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg text-navy-300 hover:text-white text-sm font-medium transition-colors"
            >
              Chat
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg text-navy-400 hover:text-red-400 text-sm transition-colors"
            >
              Log ud
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-28 px-6 max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Min konto</h1>

        {/* User info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Brugeroplysninger
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-navy-500 font-medium block mb-1">Email</label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-navy-200">{user.email}</p>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-400/15 text-gold-300 text-[10px] font-semibold tracking-wide">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs text-navy-500 font-medium block mb-1">Rolle</label>
              <p className="text-sm text-navy-200">{isAdmin ? 'Administrator' : 'Bruger'}</p>
            </div>
            <div>
              <label className="text-xs text-navy-500 font-medium block mb-1">Oprettet</label>
              <p className="text-sm text-navy-200">{createdAt}</p>
            </div>
            <div>
              <label className="text-xs text-navy-500 font-medium block mb-1">Bruger-ID</label>
              <p className="text-xs text-navy-500 font-mono">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="glass rounded-2xl p-6 gold-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Abonnement
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-green-400">Gratis plan</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-medium">
                  AKTIV
                </span>
              </div>
              <p className="text-xs text-navy-500">
                Fuld adgang til AI-juridisk assistent
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg border border-gold-400/30 text-gold-300 text-sm font-medium hover:bg-gold-400/10 transition-all cursor-not-allowed opacity-50"
              disabled
            >
              Opgrader
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
