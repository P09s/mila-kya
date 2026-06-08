import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { query, items } = await req.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a search assistant for an Indian household inventory app. Return only valid JSON arrays, no markdown, no explanation.',
        },
        {
          role: 'user',
          content: `User is searching for: "${query}"
Items list: ${JSON.stringify(items)}
Return a JSON array of item IDs that match the search, ordered by relevance.
Consider Hindi/English variations — e.g. "passport" matches "travel documents", "dawaai" matches "medicine".
Only include strong matches. If nothing matches, return [].
Example: ["id1","id2"]`,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? '[]'
    const clean = text.replace(/```json|```/g, '').trim()
    const ids = JSON.parse(clean)
    return NextResponse.json({ ids })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ids: [] })
  }
}