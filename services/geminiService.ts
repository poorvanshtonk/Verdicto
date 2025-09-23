import { GoogleGenAI, Type, type Chat } from "@google/genai"
import type { LegalSummary } from "../types"

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable not set. Please add your Google AI API key to your environment variables.",
    )
  }
  return new GoogleGenAI({ apiKey })
}

const summarySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, descriptive title for the legal document.",
    },
    summary: {
      type: Type.STRING,
      description: "A comprehensive, easy-to-understand summary of the entire legal document.",
    },
    benefits: {
      type: Type.ARRAY,
      description: "A list of advantages or positive outcomes for the user if they sign the document.",
      items: { type: Type.STRING },
    },
    risks: {
      type: Type.ARRAY,
      description: "A list of potential disadvantages, risks, or liabilities the user would be exposed to by signing.",
      items: { type: Type.STRING },
    },
    authoritiesGranted: {
      type: Type.ARRAY,
      description:
        "A list outlining the specific powers, rights, or permissions the user would grant to another party by signing.",
      items: { type: Type.STRING },
    },
    extractedClauses: {
      type: Type.ARRAY,
      description:
        "A list of important legal clauses extracted from the document. For each clause, provide its title and the full text of that clause.",
      items: {
        type: Type.OBJECT,
        properties: {
          clauseTitle: {
            type: Type.STRING,
            description: "The title or name of the legal clause (e.g., 'Governing Law', 'Limitation of Liability').",
          },
          clauseText: {
            type: Type.STRING,
            description: "The full, verbatim text of the extracted legal clause.",
          },
        },
        required: ["clauseTitle", "clauseText"],
      },
    },
  },
  required: ["title", "summary", "benefits", "risks", "authoritiesGranted", "extractedClauses"],
}

export async function summarizeDocument(
  documentText: string,
  docType: string,
  jurisdiction: string,
): Promise<LegalSummary> {
  const ai = getGeminiClient()

  let persona = "You are a legal expert AI."
  if (jurisdiction && jurisdiction !== "General") {
    persona += ` You specialize in the laws and legal norms of ${jurisdiction}.`
  }

  let task = "Analyze the following legal document text."
  if (docType && docType !== "General") {
    task = `Analyze the following ${docType} text.`
  }

  const prompt = `${persona} ${task} Provide a concise summary, list the key benefits for the user signing it, identify potential risks or non-benefits, and clearly outline the authorities or permissions the user would grant by signing. Additionally, extract key legal clauses such as 'Governing Law', 'Limitation of Liability', 'Termination', and 'Confidentiality'. Structure your response strictly according to the provided JSON schema. Ensure all fields are populated. Document Text: \n\n${documentText}`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.2,
      },
    })

    const jsonText = response.text.trim()
    const parsedJson = JSON.parse(jsonText)
    return parsedJson as LegalSummary
  } catch (error) {
    console.error("Error summarizing document:", error)
    throw new Error(
      "Failed to get a valid summary from the AI. The document might be too complex or formatted incorrectly.",
    )
  }
}

export function createChat(documentContext: string | null): Chat {
  const ai = getGeminiClient()

  let systemInstruction =
    "You are a helpful AI legal assistant. Always start your first response in any conversation with the disclaimer: 'Disclaimer: I am an AI assistant and this is not legal advice. Please consult with a qualified legal professional.'"

  if (documentContext) {
    systemInstruction += ` The user has provided a legal document for context. Prioritize answering questions based on this document. If the question is unrelated to the document, you can use your general knowledge or the search tool. Here is the document: "${documentContext}".`
  } else {
    systemInstruction +=
      " You can answer general legal questions, but remind the user to consult a professional for specific cases. Use the search tool for questions about recent events or specific facts."
  }

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.5,
      tools: [{ googleSearch: {} }],
    },
  })

  return chat
}
