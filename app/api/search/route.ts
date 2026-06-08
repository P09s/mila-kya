import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { query, items } = await req.json()
    if (!query || !items?.length) return NextResponse.json({ ids: [] })

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `The user is searching for: "${query}"
Here is their item inventory: ${JSON.stringify(items)}

Return a JSON array of item IDs that match the search query, ordered by relevance. Consider synonyms, Hindi/English equivalents, and category matches (e.g. "warm clothes" should match winter jackets, sweaters etc.)
["id1", "id2"]

Return ONLY the JSON array. If nothing matches, return [].`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const ids = JSON.parse(clean)

    return NextResponse.json({ ids })
  } catch (err) {
    console.error('Semantic search error:', err)
    return NextResponse.json({ ids: [] })
  }
}