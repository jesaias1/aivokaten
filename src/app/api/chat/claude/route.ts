import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Beskeder mangler' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'Anthropic API nøgle mangler. Tilføj ANTHROPIC_API_KEY i .env.local' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })

    let stream
    try {
      stream = await client.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      })
    } catch (apiErr: unknown) {
      console.error('Claude API init error:', apiErr)
      const errObj = apiErr as { status?: number; message?: string; error?: { message?: string } }
      const msg = errObj?.error?.message || errObj?.message || 'Kunne ikke oprette forbindelse til Claude API'
      return Response.json({ error: `Claude API fejl: ${msg}` }, { status: errObj?.status || 500 })
    }

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta
              if ('text' in delta) {
                controller.enqueue(encoder.encode(delta.text))
              }
            }
          }
          controller.close()
        } catch (err) {
          console.error('Claude streaming error:', err)
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
    console.error('Claude API error:', err)
    const message = err instanceof Error ? err.message : 'Ukendt fejl'
    return Response.json({ error: message }, { status: 500 })
  }
}
