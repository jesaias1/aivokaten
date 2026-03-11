'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AIModel, ChatMessage, ChatSession } from '@/lib/types'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function ChatPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<AIModel>('demo')
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aivokaten-sessions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSessions(parsed)
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id)
        }
      } catch {
        // ignore
      }
    }
  }, [])

  // Save sessions to localStorage
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    setSessions(newSessions)
    localStorage.setItem('aivokaten-sessions', JSON.stringify(newSessions))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const createNewSession = () => {
    const session: ChatSession = {
      id: generateId(),
      title: 'Ny samtale',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const newSessions = [session, ...sessions]
    saveSessions(newSessions)
    setActiveSessionId(session.id)
  }

  const deleteSession = (id: string) => {
    const newSessions = sessions.filter((s) => s.id !== id)
    saveSessions(newSessions)
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    let currentSessionId = activeSessionId
    let currentSessions = [...sessions]

    // Create session if none exists
    if (!currentSessionId) {
      const session: ChatSession = {
        id: generateId(),
        title: 'Ny samtale',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      currentSessions = [session, ...currentSessions]
      currentSessionId = session.id
      setActiveSessionId(session.id)
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    // Update session with user message
    currentSessions = currentSessions.map((s) =>
      s.id === currentSessionId
        ? {
            ...s,
            messages: [...s.messages, userMessage],
            title: s.messages.length === 0 ? input.trim().slice(0, 50) : s.title,
            updatedAt: Date.now(),
          }
        : s
    )
    saveSessions(currentSessions)
    setInput('')

    // Stream AI response
    setIsStreaming(true)
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      model: selectedModel,
      timestamp: Date.now(),
    }

    // Add placeholder message
    currentSessions = currentSessions.map((s) =>
      s.id === currentSessionId
        ? { ...s, messages: [...s.messages, assistantMessage] }
        : s
    )
    saveSessions(currentSessions)

    try {
      const sessionMessages = currentSessions.find((s) => s.id === currentSessionId)?.messages || []
      const apiMessages = sessionMessages
        .filter((m) => m.id !== assistantMessage.id)
        .map((m) => ({ role: m.role, content: m.content }))

      const endpoint = selectedModel === 'claude' ? '/api/chat/claude' : selectedModel === 'openai' ? '/api/chat/openai' : '/api/chat/demo'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API fejl: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          fullContent += chunk

          // Update the assistant message content
          currentSessions = currentSessions.map((s) =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent }
                      : m
                  ),
                  updatedAt: Date.now(),
                }
              : s
          )
          saveSessions(currentSessions)
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ukendt fejl'
      currentSessions = currentSessions.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: `⚠️ Fejl: ${errorMsg}` }
                  : m
              ),
            }
          : s
      )
      saveSessions(currentSessions)
    } finally {
      setIsStreaming(false)
    }
  }

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

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } flex-shrink-0 transition-all duration-300 overflow-hidden`}
      >
        <div className="w-72 h-full flex flex-col glass border-r border-navy-800">
          {/* Sidebar header */}
          <div className="p-4 border-b border-navy-800">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold text-xs">
                Ai
              </div>
              <span className="font-bold text-sm">Aivokaten</span>
            </Link>
            <button
              onClick={createNewSession}
              className="w-full py-2 px-3 rounded-lg border border-navy-700 text-sm text-navy-300 hover:text-white hover:border-gold-400/30 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ny samtale
            </button>
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 && (
              <p className="text-navy-500 text-xs text-center py-4">
                Ingen samtaler endnu
              </p>
            )}
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                  session.id === activeSessionId
                    ? 'bg-navy-700/50 text-white'
                    : 'text-navy-400 hover:bg-navy-800/50 hover:text-navy-200'
                }`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="flex-1 truncate">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-navy-500 hover:text-red-400 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar footer */}
          <div className="p-3 border-t border-navy-800 space-y-1">
            <Link
              href="/konto"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-navy-400 hover:text-white hover:bg-navy-800/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Min konto
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-navy-400 hover:text-red-400 hover:bg-navy-800/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log ud
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 flex items-center justify-between px-4 glass border-b border-navy-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-navy-800/50 text-navy-400 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-medium text-navy-300 truncate">
              {activeSession?.title || 'Aivokaten'}
            </h2>
          </div>

          {/* Model selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-500 hidden sm:inline">AI-model:</span>
            <div className="flex rounded-lg overflow-hidden border border-navy-700">
              <button
                onClick={() => setSelectedModel('demo')}
                className={`px-3 py-1.5 text-xs font-medium transition-all border-r border-navy-700 ${
                  selectedModel === 'demo'
                    ? 'bg-gradient-to-r from-gold-400/20 to-gold-300/20 text-gold-300'
                    : 'text-navy-400 hover:text-navy-200'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setSelectedModel('claude')}
                className={`px-3 py-1.5 text-xs font-medium transition-all border-r border-navy-700 ${
                  selectedModel === 'claude'
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300'
                    : 'text-navy-400 hover:text-navy-200'
                }`}
              >
                Claude
              </button>
              <button
                onClick={() => setSelectedModel('openai')}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedModel === 'openai'
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300'
                    : 'text-navy-400 hover:text-navy-200'
                }`}
              >
                ChatGPT
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-300 flex items-center justify-center text-navy-950 font-bold text-2xl mx-auto mb-6">
                  Ai
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Velkommen til Aivokaten
                </h3>
                <p className="text-navy-400 text-sm mb-6">
                  Stil et spørgsmål om dansk erhvervsret. Jeg hjælper dig med præcise svar og lovhenvisninger.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Hvad er forskellen mellem ApS og A/S?',
                    'Hvornår kan en erhvervslejekontrakt opsiges?',
                    'Hvad siger konkurrencelovens §6?',
                    'Krav til bestyrelse i A/S selskaber?',
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q)
                        textareaRef.current?.focus()
                      }}
                      className="text-left p-3 rounded-xl glass-light text-xs text-navy-300 hover:text-white transition-all hover:border-gold-400/20"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-1">
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className="animate-fade-in">
                  {msg.role === 'user' ? (
                    <div className="flex justify-end mb-4">
                      <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-navy-600/50 text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                          msg.model === 'claude'
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                            : msg.model === 'openai'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                            : 'bg-gradient-to-br from-gold-400 to-gold-300 text-navy-950'
                        }`}>
                          {msg.model === 'claude' ? 'C' : msg.model === 'openai' ? 'G' : 'D'}
                        </div>
                        <span className="text-[10px] text-navy-500 font-medium">
                          {msg.model === 'claude' ? 'Claude (Anthropic)' : msg.model === 'openai' ? 'ChatGPT (OpenAI)' : 'Demo'}
                        </span>
                      </div>
                      <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-sm glass-light text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content || (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full typing-dot" />
                            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full typing-dot" />
                            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full typing-dot" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-navy-800">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 glass rounded-2xl p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Stil et juridisk spørgsmål..."
                rows={1}
                className="flex-1 bg-transparent resize-none text-sm placeholder-navy-500 focus:outline-none px-2 py-1.5 max-h-[200px]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-300 text-navy-950 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold-400/20 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-navy-600 text-center mt-2">
              Aivokaten er et AI-værktøj og erstatter ikke professionel juridisk rådgivning
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
