'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-navy-400/[0.06] blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] rounded-full bg-gold-400/[0.02] blur-[150px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold text-xs transition-transform duration-300 group-hover:scale-105">
              Ai
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90">
              Aivokaten
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                href="/chat"
                className="px-5 py-2 rounded-full bg-white text-navy-950 text-sm font-medium hover:bg-white/90 transition-all duration-300"
              >
                Åbn chat
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-full text-white/60 hover:text-white text-sm font-medium transition-all duration-300"
                >
                  Log ind
                </Link>
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-full bg-white text-navy-950 text-sm font-medium hover:bg-white/90 transition-all duration-300"
                >
                  Kom i gang
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-32 px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-[11px] tracking-wider uppercase text-gold-300/80 font-medium mb-10 transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
            Juridisk AI-assistent
          </div>

          {/* Main headline */}
          <h1
            className={`text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-7 transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-white">Præcis jura.</span>
            <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              På sekunder.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg text-white/40 max-w-md mx-auto leading-relaxed font-light mb-12 transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            AI-drevet juridisk assistent til alle områder af dansk ret. Bygget til advokater der kræver præcision og korrekte lovhenvisninger.
          </p>

          {/* CTA */}
          <div
            className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              href={user ? '/chat' : '/auth'}
              className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 text-navy-950 font-semibold text-sm inline-flex items-center gap-2 hover:shadow-[0_0_40px_rgba(242,180,38,0.15)] transition-all duration-500"
            >
              {user ? 'Gå til chat' : 'Prøv gratis'}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider line */}
      <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Features — minimal */}
      <section className="py-28 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-14">
            {[
              {
                label: 'Alle retsområder',
                desc: 'Strafferet, familieret, erhvervsret, skatteret og meget mere — ét samlet juridisk arbejdsredskab.',
              },
              {
                label: 'Præcise paragrafhenvisninger',
                desc: 'Automatiske henvisninger til specifikke love og paragraffer fra dansk lovgivning.',
              },
              {
                label: 'Vælg AI-model',
                desc: 'Skift mellem Claude og ChatGPT. Sammenlign perspektiver fra begge modeller side om side.',
              },
              {
                label: 'Fuld samtalehistorik',
                desc: 'Alle samtaler gemmes i din browser. Fortsæt tidligere sessioner og søg i historikken.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`transition-all duration-1000 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${900 + i * 150}ms` }}
              >
                <div className="w-8 h-px bg-gold-400/40 mb-5" />
                <h3 className="text-sm font-semibold text-white/90 mb-2 tracking-[-0.01em]">
                  {f.label}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider line */}
      <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Social proof / trust */}
      <section className="py-28 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-semibold text-white/90 leading-snug tracking-[-0.02em] mb-6">
            &ldquo;Spar timer på juridisk research. Få svar med lovhenvisninger — øjeblikkeligt.&rdquo;
          </p>
          <p className="text-sm text-white/30 font-light">
            Bygget til danske advokater
          </p>
        </div>
      </section>

      {/* Divider line */}
      <div className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Bottom CTA */}
      <section className="py-28 px-8">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-[-0.02em] mb-4 text-white/90">
            Klar til at starte?
          </h2>
          <p className="text-sm text-white/35 mb-8 font-light">
            Opret en gratis konto og oplev AI-juridisk rådgivning.
          </p>
          <Link
            href={user ? '/chat' : '/auth'}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-navy-950 font-semibold text-sm hover:bg-white/90 transition-all duration-300"
          >
            {user ? 'Åbn chat' : 'Opret gratis konto'}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold text-[8px]">
              Ai
            </div>
            <span className="text-xs text-white/25">
              © 2026 Aivokaten
            </span>
          </div>
          <p className="text-[11px] text-white/15">
            Erstatter ikke professionel juridisk rådgivning.
          </p>
        </div>
      </footer>
    </div>
  )
}
