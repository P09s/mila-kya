import { NextRequest, NextResponse } from 'next/server'

async function classifyImage(image: string, mimeType: string): Promise<'diary' | 'photo'> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
          { type: 'text', text: `Does this image show a handwritten diary, written list, inventory register, or printed text page? Answer ONLY with one word: "diary" or "photo".` }
        ]
      }],
      max_tokens: 5,
    })
  })
  const data = await response.json()
  const answer = data.choices?.[0]?.message?.content?.trim().toLowerCase() ?? 'photo'
  return answer.includes('diary') ? 'diary' : 'photo'
}

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'no_key' }, { status: 500 })
    }

    // Validate: must be a diary/text image
    const type = await classifyImage(image, mimeType || 'image/jpeg')
    if (type !== 'diary') {
      return NextResponse.json({ error: 'wrong_image_type', expected: 'diary' }, { status: 422 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${image}` } },
            { type: 'text', text: `Look at this handwritten or printed diary/inventory page. Extract ALL items.

                This may be a table with columns like: Room → Storage unit → Item name.
                Example row: "Bedroom 2 | Almirah | Cash" → name=Cash, room_hint=Bedroom 2, sub_location=Almirah
                Example row: "Kitchen | Pantry | Elaichi" → name=Elaichi, room_hint=Kitchen, sub_location=Pantry
                
                Return a JSON array like:
                [{"name":"Cash","room_hint":"Bedroom 2","sub_location":"Almirah","quantity":"","notes":""}]
                
                - name: the actual ITEM only (e.g. Cash, Book, Elaichi) — never the room or storage unit
                - room_hint: room/location label from that row (e.g. "Bedroom 2", "Kitchen") — if visible
                - sub_location: storage unit within room (e.g. "Almirah", "Drawer", "Pantry") — if visible
                - quantity: only if a quantity is written next to the item
                - notes: any other extra text only
                - If no columns exist, just set name and leave rest empty
                
                Return ONLY the JSON array, no other text, no markdown.` }
          ]
        }],
        max_tokens: 1000,
      })
    })

    const data = await response.json()
    if (!response.ok) {
      const isRateLimit = response.status === 429
      return NextResponse.json({ error: isRateLimit ? 'rate_limit' : 'scan_failed' }, { status: response.status })
    }

    const text = data.choices[0].message.content.trim().replace(/```json|```/g, '').trim()
    const items = JSON.parse(text)
    return NextResponse.json({ items })

  } catch (e: any) {
    console.error('Diary scan error:', e?.message ?? e)
    return NextResponse.json({ error: 'scan_failed' }, { status: 500 })
  }
}