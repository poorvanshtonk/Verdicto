import { Gavel } from "@/components/icons"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
          <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-blue-600">Thank you for signing up!</h1>
            <p className="text-gray-500 mt-2">Check your email to confirm</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              You've successfully signed up. Please check your email to confirm your account before signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
