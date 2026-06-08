import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()
    if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 })

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `This is a photo of a handwritten or printed list of household items/belongings from an Indian household.
Extract each item as a JSON array. Support both Hindi (Devanagari) and English text.
[{"name": "item name exactly as written", "quantity": "if mentioned, else null", "notes": "any notes or location mentioned"}]

Return ONLY the JSON array, no markdown, no other text.`

    const result = await model.generateContent([
      { inlineData: { data: image, mimeType: mimeType || 'image/jpeg' } },
      prompt,
    ])

    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const items = JSON.parse(clean)

    return NextResponse.json({ items })
  } catch (err) {
    console.error('Diary scan error:', err)
    return NextResponse.json({ error: 'Scan failed', items: [] }, { status: 500 })
  }
}