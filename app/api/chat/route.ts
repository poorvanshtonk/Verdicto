import { type NextRequest, NextResponse } from "next/server"
import { createChat } from "../../../services/geminiService"

export async function POST(request: NextRequest) {
  try {
    const { message, documentContext, isNewChat } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create a new chat instance for each request
    const chat = createChat(documentContext)

    const response = await chat.sendMessage({ message })

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    const sources =
      groundingChunks?.map((chunk: any) => chunk.web).filter((web: any) => web && web.uri && web.title) || []

    return NextResponse.json({
      text: response.text,
      sources: sources.length > 0 ? sources : undefined,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
