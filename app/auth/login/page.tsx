"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Gavel, AtSign, Lock, AlertTriangle } from "@/components/icons"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
          <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-blue-600">Welcome Back</h1>
            <p className="text-gray-500">Log in to continue to Verdicto.</p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center"
              role="alert"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-700 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <AtSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-700 tracking-wide">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
