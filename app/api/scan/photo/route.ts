import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing!')
      return NextResponse.json({ error: 'no_key' }, { status: 500 })
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
            { type: 'text', text: `Look at this image and identify all visible items/objects a person might want to track at home.
For each item return a JSON array like:
[{"name":"Blue handbag","name_hi":"नीला हैंडबैग","category":"Clothes","emoji":"👜","confidence":0.9}]
Categories: Documents, Clothes, Electronics, Jewellery, Medicine, Kitchen, Books, Seasonal, Kids, Other.
Return ONLY the JSON array, no other text, no markdown.` }
          ]
        }],
        max_tokens: 1000,
      })
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Groq error:', data)
      const isRateLimit = response.status === 429
      return NextResponse.json({ error: isRateLimit ? 'rate_limit' : 'scan_failed' }, { status: response.status })
    }

    const text = data.choices[0].message.content.trim().replace(/```json|```/g, '').trim()
    const items = JSON.parse(text)
    return NextResponse.json({ items })

  } catch (e: any) {
    console.error('Scan error:', e?.message ?? e)
    return NextResponse.json({ error: 'scan_failed' }, { status: 500 })
  }
}