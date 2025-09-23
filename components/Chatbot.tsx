"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
// import { createChat } from '../services/geminiService';
import type { ChatMessage, Source } from "../types"
import { MessageSquare, X, Send, Bot, Link } from "./icons"

interface ChatbotProps {
  documentContext: string | null
}

const SourceList: React.FC<{ sources: Source[] }> = ({ sources }) => (
  <div className="mt-2 border-t border-gray-200 pt-2">
    <h4 className="text-xs font-bold text-gray-500 mb-1">Sources:</h4>
    <ul className="space-y-1">
      {sources.map((source, index) => (
        <li key={index} className="flex items-center gap-2">
          <Link className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <a
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate"
            title={source.title}
          >
            {source.title || new URL(source.uri).hostname}
          </a>
        </li>
      ))}
    </ul>
  </div>
)

export const Chatbot: React.FC<ChatbotProps> = ({ documentContext }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset and initialize chat when document context changes
    setMessages([])
    // chatRef.current = createChat(documentContext);
  }, [documentContext])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === "" || isLoading) return

    const userMessage: ChatMessage = { role: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          documentContext,
          isNewChat: messages.length === 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      const modelMessage: ChatMessage = {
        role: "model",
        text: data.text,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, modelMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, documentContext, messages.length])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-110 focus:outline-none z-50"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col z-40 animate-fade-in-up">
          <header className="bg-brand-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-xl font-bold">AI Legal Assistant</h3>
          </header>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot className="w-16 h-16 mb-4" />
                <p className="font-semibold">Welcome!</p>
                <p>Ask me anything about your document or general legal topics.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 my-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-brand-dark rounded-bl-none"}`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && <SourceList sources={msg.sources} />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 my-2 justify-start">
                <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-brand-dark rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || input.trim() === ""}
                className="bg-brand-primary text-white p-3 rounded-full hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
