import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()
    if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 })

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Look at this image and identify all visible items/objects that a person might want to track in their home inventory.
For each item return a JSON array:
[{"name": "Blue handbag", "name_hi": "नीला हैंडबैग", "category": "Clothes", "emoji": "👜", "confidence": 0.9}]

Categories (use only these): Documents, Clothes, Electronics, Jewellery, Medicine, Kitchen, Books, Seasonal, Kids, Other
Pick the most appropriate single emoji for each item.
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
    console.error('Photo scan error:', err)
    return NextResponse.json({ error: 'Scan failed', items: [] }, { status: 500 })
  }
}