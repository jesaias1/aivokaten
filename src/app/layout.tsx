import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Aivokaten — AI-juridisk assistent til alle danske advokater',
  description:
    'AI-drevet juridisk assistent med præcise lovhenvisninger inden for alle områder af dansk ret. Strafferet, erhvervsret, familieret og meget mere.',
  keywords:
    'dansk jura, AI advokat, strafferet, erhvervsret, familieret, ansættelsesret, skatteret, aftaleret, forvaltningsret, ejendomsret, EU-ret, juridisk AI, lovhenvisninger',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
