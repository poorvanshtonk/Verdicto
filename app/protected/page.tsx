import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Protected Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome, {data.user.email}!</h2>
          <p className="text-gray-600">This is a protected page that requires authentication.</p>
        </div>
      </div>
    </div>
  )
}
