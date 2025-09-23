import { type NextRequest, NextResponse } from "next/server"
import { summarizeDocument } from "../../../services/geminiService"

export async function POST(request: NextRequest) {
  try {
    const { documentText, docType, jurisdiction } = await request.json()

    if (!documentText) {
      return NextResponse.json({ error: "Document text is required" }, { status: 400 })
    }

    const result = await summarizeDocument(documentText, docType, jurisdiction)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in summarize API:", error)
    return NextResponse.json({ error: error.message || "Failed to summarize document" }, { status: 500 })
  }
}
