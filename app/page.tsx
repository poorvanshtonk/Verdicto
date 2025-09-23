"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { HomePage } from "../components/HomePage"
import { SummaryPage } from "../components/SummaryPage"
import { Chatbot } from "../components/Chatbot"
import { Header } from "../components/Header"
import { extractTextFromPdf } from "../services/pdfService"
import type { LegalSummary, User, SavedDocument } from "../types"
import { AlertTriangle } from "../components/icons"
import { IntroPage } from "../components/IntroPage"
import { DashboardPage } from "../components/DashboardPage"
import { WorkspaceSetupPage } from "../components/WorkspaceSetupPage"
import { WorkspaceUnlockPage } from "../components/WorkspaceUnlockPage"
import { WorkspacePage } from "../components/WorkspacePage"
import { ProgressLoader } from "../components/ProgressLoader"
import { exampleDocumentText } from "../services/exampleDocument"
import { PrivacyPolicyPage } from "../components/PrivacyPolicyPage"
import { DeveloperApiPage } from "../components/DeveloperApiPage"
import { PricingPage } from "../components/PricingPage"
import { UpgradeModal } from "../components/UpgradeModal"
import { ESignatureModal } from "../components/ESignatureModal"
import { createClient } from "../lib/supabase/client"
import { useRouter } from "next/navigation"

type View =
  | "home"
  | "summary"
  | "dashboard"
  | "workspace"
  | "workspaceSetup"
  | "workspaceUnlock"
  | "privacyPolicy"
  | "developerApi"
  | "pricing"
type AuthState = "splash" | "intro" | "app"
type AuthOrAppView = AuthState | View

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>("splash")
  const [view, setView] = useState<View>("home")
  const [summary, setSummary] = useState<LegalSummary | null>(null)
  const [documentText, setDocumentText] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [previousView, setPreviousView] = useState<AuthOrAppView>("home")
  const [progressStep, setProgressStep] = useState(0)
  const [documentOptions, setDocumentOptions] = useState<{ docType: string; jurisdiction: string }>({
    docType: "",
    jurisdiction: "",
  })
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      console.log("[v0] Checking user authentication...")
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        console.log("[v0] User check result:", user ? "authenticated" : "not authenticated")
        console.log("[v0] User check error:", error)

        if (error) {
          console.log("[v0] Auth error:", error.message)
          setAuthState("intro")
          return
        }

        if (user) {
          console.log("[v0] User found:", user.email)
          setUser(user)
          setAuthState("app")
        } else {
          console.log("[v0] No user found")
          setAuthState("intro")
        }
      } catch (err) {
        console.log("[v0] Auth check failed:", err)
        setAuthState("intro")
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, session?.user ? `user: ${session.user.email}` : "no user")

      if (event === "SIGNED_IN" && session?.user) {
        console.log("[v0] User signed in:", session.user.email)
        setUser(session.user)
        setAuthState("app")
      } else if (event === "SIGNED_OUT" || !session?.user) {
        console.log("[v0] User signed out or no session")
        setUser(null)
        setAuthState("intro")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleDocumentProcess = useCallback(
    async (file: File, docType: string, jurisdiction: string) => {
      if (!file || !user) return

      setIsLoading(true)
      setError(null)
      setFileName(file.name)
      setDocumentOptions({ docType, jurisdiction })

      try {
        setProgressStep(1) // Uploading
        await new Promise((res) => setTimeout(res, 500))

        setProgressStep(2) // Extracting
        setLoadingMessage("Extracting text from document...")
        const text = await extractTextFromPdf(file)
        setDocumentText(text)

        if (text.trim().length < 100) {
          throw new Error("Document content is too short or could not be read. Please try another file.")
        }

        setProgressStep(3) // Analyzing
        setLoadingMessage("AI is analyzing the document... This may take a moment.")

        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentText: text,
            docType,
            jurisdiction,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze document")
        }

        const result = await response.json()
        setSummary(result)
        setPreviousView(view)
        setView("summary")
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
        setLoadingMessage("")
        setProgressStep(0)
      }
    },
    [view, user],
  )

  const handleProcessExample = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setFileName("Example-NDA.pdf")
    setDocumentOptions({ docType: "Non-Disclosure Agreement", jurisdiction: "USA" })

    try {
      setProgressStep(3) // Skip to analyzing step
      setDocumentText(exampleDocumentText)
      setLoadingMessage("AI is analyzing the example document...")

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText: exampleDocumentText,
          docType: "Non-Disclosure Agreement",
          jurisdiction: "USA",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze document")
      }

      const result = await response.json()

      setSummary(result)
      setPreviousView(view)
      setView("summary")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      setLoadingMessage("")
      setProgressStep(0)
    }
  }, [view])

  const handleProcessCloudFile = useCallback(
    async (cloudFileName: string) => {
      setIsLoading(true)
      setError(null)
      setFileName(cloudFileName)
      setDocumentOptions({ docType: "General", jurisdiction: "General" })

      try {
        setProgressStep(1) // "Uploading" from cloud
        await new Promise((res) => setTimeout(res, 500))
        setProgressStep(2) // "Extracting"
        await new Promise((res) => setTimeout(res, 500))

        setDocumentText(exampleDocumentText) // Use example text for all cloud docs in this demo

        setProgressStep(3) // Analyzing
        setLoadingMessage("AI is analyzing the document...")

        const response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentText: exampleDocumentText,
            docType: "General",
            jurisdiction: "General",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze document")
        }

        const result = await response.json()

        setSummary(result)
        setPreviousView(view)
        setView("summary")
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
        setLoadingMessage("")
        setProgressStep(0)
      }
    },
    [view],
  )

  const handleBack = () => {
    if (["privacyPolicy", "developerApi", "pricing"].includes(view)) {
      if (["login", "signup", "intro"].includes(previousView as string)) {
        setAuthState(previousView as AuthState)
      } else {
        setView(previousView as View)
      }
    } else {
      setView("home") // Always go back to home from summary
      setSummary(null)
      setDocumentText(null)
      setError(null)
      setFileName("")
      setDocumentOptions({ docType: "", jurisdiction: "" })
    }
  }

  const handleNavigateToDashboard = () => {
    setView("dashboard")
  }

  const handleNavigateToWorkspace = () => {
    if (user?.workspacePassword) {
      setView("workspaceUnlock")
    } else {
      setView("workspace")
    }
  }

  const handleNavigateToWorkspaceSetup = () => {
    setView("workspaceSetup")
  }

  const handleAttemptNavigateToApiPage = () => {
    if (user?.plan === "free") {
      setIsUpgradeModalOpen(true)
      return
    }
    setPreviousView("dashboard")
    setView("developerApi")
  }

  const handleNavigateToPrivacyPolicy = () => {
    setPreviousView(authState === "app" ? view : authState)
    setView("privacyPolicy")
  }

  const handleNavigateToPricing = () => {
    setPreviousView(view)
    setView("pricing")
  }

  const handleUpdateUser = (updatedUser: User) => {
    // Placeholder for user update logic
  }

  const handleWorkspaceSetup = (password: string, hint: string) => {
    if (user) {
      setUser({ ...user, workspacePassword: password, workspaceHint: hint })
      setView("workspace")
    }
  }

  const handleWorkspaceUnlock = (password: string): boolean => {
    if (password === "FINGERPRINT_SUCCESS" || user?.workspacePassword === password) {
      setView("workspace")
      return true
    }
    return false
  }

  const handleSaveToWorkspace = (summaryToSave: LegalSummary, notes: string) => {
    if (user && documentText && fileName) {
      setNotification("Document saved to your workspace!")
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleAttemptSendForSignature = () => {
    if (user?.plan === "free") {
      setIsUpgradeModalOpen(true)
    } else {
      setIsSignatureModalOpen(true)
    }
  }

  const handleViewWorkspaceDocument = (doc: SavedDocument) => {
    setSummary(doc.summary)
    setFileName(doc.fileName)
    setDocumentText(doc.documentText)
    setDocumentOptions({ docType: doc.docType, jurisdiction: doc.jurisdiction })
    setPreviousView("workspace")
    setView("summary")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setView("home")
    setAuthState("intro")
  }

  const handleNavigateToLogin = () => {
    router.push("/auth/login")
  }

  const handleNavigateToSignup = () => {
    router.push("/auth/signup")
  }

  const renderAppContent = () => {
    if (isLoading) {
      return <ProgressLoader step={progressStep} />
    }

    if (error && !["home", "workspaceUnlock", "dashboard"].includes(view)) {
      return (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    switch (view) {
      case "pricing":
        return <PricingPage onBack={handleBack} />
      case "privacyPolicy":
        return <PrivacyPolicyPage onBack={handleBack} />
      case "developerApi":
        return user && <DeveloperApiPage user={user} onBack={handleBack} />
      case "summary":
        return (
          summary && (
            <SummaryPage
              summary={summary}
              fileName={fileName}
              onBack={handleBack}
              onSaveToWorkspace={handleSaveToWorkspace}
              onAttemptSendForSignature={handleAttemptSendForSignature}
              isSaved={false}
              initialNotes=""
            />
          )
        )
      case "dashboard":
        return (
          user && (
            <DashboardPage
              user={user}
              onUpdateUser={() => {}}
              onNavigateToWorkspace={handleNavigateToWorkspace}
              onNavigateToWorkspaceSetup={handleNavigateToWorkspaceSetup}
              onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
              onAttemptNavigateToApiPage={handleAttemptNavigateToApiPage}
              onNavigateToPricing={handleNavigateToPricing}
            />
          )
        )
      case "workspaceSetup":
        return (
          <WorkspaceSetupPage
            onSetupComplete={handleWorkspaceSetup}
            onCancel={() => setView("dashboard")}
            isReset={false}
          />
        )
      case "workspaceUnlock":
        return <WorkspaceUnlockPage onUnlock={handleWorkspaceUnlock} hint="" onGoHome={() => setView("home")} />
      case "workspace":
        return (
          <WorkspacePage documents={[]} onViewDocument={handleViewWorkspaceDocument} onGoHome={() => setView("home")} />
        )
      case "home":
      default:
        return (
          <HomePage
            onProcessDocument={handleDocumentProcess}
            onProcessExample={handleProcessExample}
            onProcessCloudFile={handleProcessCloudFile}
            user={user}
            onViewDocument={handleViewWorkspaceDocument}
          />
        )
    }
  }

  if (authState !== "app") {
    let AuthComponent
    switch (authState) {
      case "splash":
        AuthComponent = (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )
        break
      case "intro":
      default:
        AuthComponent = (
          <IntroPage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToSignup={handleNavigateToSignup}
            onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
          />
        )
        break
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-900 font-sans flex flex-col items-center justify-center p-4">
        {AuthComponent}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-900 font-sans flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        onNavigateToHome={() => setView("home")}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToWorkspace={handleNavigateToWorkspace}
        onNavigateToPricing={handleNavigateToPricing}
      />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-start justify-center">
        {notification && (
          <div
            className="fixed top-24 right-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
            role="alert"
          >
            <span className="block sm:inline">{notification}</span>
          </div>
        )}
        {renderAppContent()}
      </main>
      {isUpgradeModalOpen && (
        <UpgradeModal
          onClose={() => setIsUpgradeModalOpen(false)}
          onUpgrade={() => {
            setIsUpgradeModalOpen(false)
            handleNavigateToPricing()
          }}
        />
      )}
      {isSignatureModalOpen && <ESignatureModal fileName={fileName} onClose={() => setIsSignatureModalOpen(false)} />}
      <Chatbot documentContext={documentText} />
    </div>
  )
}

export default App
