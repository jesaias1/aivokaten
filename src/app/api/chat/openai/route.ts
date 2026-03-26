import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt: incomingSystemPrompt } = await req.json()
    const resolvedSystemPrompt: string = typeof incomingSystemPrompt === 'string' && incomingSystemPrompt.length > 0
      ? incomingSystemPrompt
      : SYSTEM_PROMPT

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Beskeder mangler' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'OpenAI API nøgle mangler. Tilføj OPENAI_API_KEY i .env.local' },
        { status: 500 }
      )
    }

    const client = new OpenAI({ apiKey })

    let stream
    try {
      stream = await client.chat.completions.create({
        model: 'gpt-4o',
        stream: true,
        messages: [
          { role: 'system', content: resolvedSystemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
          })),
        ],
      })
    } catch (apiErr: unknown) {
      console.error('OpenAI API init error:', apiErr)
      const errObj = apiErr as { status?: number; message?: string; error?: { message?: string } }
      const msg = errObj?.error?.message || errObj?.message || 'Kunne ikke oprette forbindelse til OpenAI API'
      return Response.json({ error: `OpenAI API fejl: ${msg}` }, { status: errObj?.status || 500 })
    }

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (err) {
          console.error('OpenAI streaming error:', err)
          const errorMsg = err instanceof Error ? err.message : 'Streaming fejl'
          controller.enqueue(encoder.encode(`\n\n⚠️ Streaming fejl: ${errorMsg}`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('OpenAI API error:', err)
    const message = err instanceof Error ? err.message : 'Ukendt fejl'
    return Response.json({ error: message }, { status: 500 })
  }
}
