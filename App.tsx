import React, { useState, useCallback, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { SummaryPage } from './components/SummaryPage';
import { Chatbot } from './components/Chatbot';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { extractTextFromPdf } from './services/pdfService';
import { summarizeDocument } from './services/geminiService';
import type { LegalSummary, User, StoredUser, SavedDocument } from './types';
import { AlertTriangle } from './components/icons';
import { IntroPage } from './components/IntroPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { DashboardPage } from './components/DashboardPage';
import { SplashPage } from './components/SplashPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { VerifyCodePage } from './components/VerifyCodePage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { initializeDB, getUserByEmail, createUser, updateUser as updateUserService, saveDocumentToWorkspace } from './services/userService';
import { VerifySignupPage } from './components/VerifySignupPage';
import { WorkspaceSetupPage } from './components/WorkspaceSetupPage';
import { WorkspaceUnlockPage } from './components/WorkspaceUnlockPage';
import { WorkspacePage } from './components/WorkspacePage';
import { ProgressLoader } from './components/ProgressLoader';
import { exampleDocumentText } from './services/exampleDocument';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { DeveloperApiPage } from './components/DeveloperApiPage';
import { PricingPage } from './components/PricingPage';
import { UpgradeModal } from './components/UpgradeModal';
import { ESignatureModal } from './components/ESignatureModal';


type View = 'home' | 'summary' | 'dashboard' | 'workspace' | 'workspaceSetup' | 'workspaceUnlock' | 'privacyPolicy' | 'developerApi' | 'pricing';
type AuthState = 'splash' | 'intro' | 'login' | 'signup' | 'app' | 'forgotPassword' | 'verifyCode' | 'resetPassword' | 'verifySignupCode';
type AuthOrAppView = AuthState | View;


const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('splash');
  const [view, setView] = useState<View>('home');
  const [summary, setSummary] = useState<LegalSummary | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [emailForReset, setEmailForReset] = useState<string>('');
  const [pendingSignup, setPendingSignup] = useState<Omit<StoredUser, 'age' | 'bio' | 'username' | 'role' | 'plan' | 'credits'> | null>(null);
  const [previousView, setPreviousView] = useState<AuthOrAppView>('home');
  const [progressStep, setProgressStep] = useState(0);
  const [documentOptions, setDocumentOptions] = useState<{ docType: string; jurisdiction: string }>({ docType: '', jurisdiction: '' });
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);


  useEffect(() => {
    initializeDB();
  }, []);

  const handleDocumentProcess = useCallback(async (file: File, docType: string, jurisdiction: string) => {
    if (!file || !user) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    setDocumentOptions({ docType, jurisdiction });

    try {
      setProgressStep(1); // Uploading
      await new Promise(res => setTimeout(res, 500));
      
      setProgressStep(2); // Extracting
      setLoadingMessage('Extracting text from document...');
      const text = await extractTextFromPdf(file);
      setDocumentText(text);

      if (text.trim().length < 100) {
          throw new Error("Document content is too short or could not be read. Please try another file.");
      }

      setProgressStep(3); // Analyzing
      setLoadingMessage('AI is analyzing the document... This may take a moment.');
      const result = await summarizeDocument(text, docType, jurisdiction);

      if (user.plan === 'free') {
        const updatedUser: StoredUser = { ...user, credits: (user.credits ?? 1) - 1 };
        const fullUser = updateUserService(updatedUser);
        setUser(fullUser);
      }
      
      setSummary(result);
      setPreviousView(view);
      setView('summary');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      setProgressStep(0);
    }
  }, [view, user]);

  const handleProcessExample = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFileName("Example-NDA.pdf");
    setDocumentOptions({ docType: 'Non-Disclosure Agreement', jurisdiction: 'USA' });

    try {
        setProgressStep(3); // Skip to analyzing step
        setDocumentText(exampleDocumentText);
        setLoadingMessage('AI is analyzing the example document...');
        const result = await summarizeDocument(exampleDocumentText, 'Non-Disclosure Agreement', 'USA');
        
        setSummary(result);
        setPreviousView(view);
        setView('summary');
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        setProgressStep(0);
    }
  }, [view]);
  
  const handleProcessCloudFile = useCallback(async (cloudFileName: string) => {
    setIsLoading(true);
    setError(null);
    setFileName(cloudFileName);
    setDocumentOptions({ docType: 'General', jurisdiction: 'General' });

    try {
        setProgressStep(1); // "Uploading" from cloud
        await new Promise(res => setTimeout(res, 500));
        setProgressStep(2); // "Extracting"
        await new Promise(res => setTimeout(res, 500));
        
        setDocumentText(exampleDocumentText); // Use example text for all cloud docs in this demo
        
        setProgressStep(3); // Analyzing
        setLoadingMessage('AI is analyzing the document...');
        const result = await summarizeDocument(exampleDocumentText, 'General', 'General');
        
        setSummary(result);
        setPreviousView(view);
        setView('summary');
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        setProgressStep(0);
    }
  }, [view]);


  const handleBack = () => {
    if (['privacyPolicy', 'developerApi', 'pricing'].includes(view)) {
        if (['login', 'signup', 'intro'].includes(previousView as string)) {
            setAuthState(previousView as AuthState);
        } else {
            setView(previousView as View);
        }
    } else {
        setView('home'); // Always go back to home from summary
        setSummary(null);
        setDocumentText(null);
        setError(null);
        setFileName('');
        setDocumentOptions({ docType: '', jurisdiction: '' });
    }
  };
  
  const handleNavigateToDashboard = () => {
    setView('dashboard');
  };
  
  const handleNavigateToWorkspace = () => {
    if (user?.workspacePassword) {
        setView('workspaceUnlock');
    } else {
        setView('workspace');
    }
  }
  
  const handleNavigateToWorkspaceSetup = () => {
    setView('workspaceSetup');
  };
  
  const handleAttemptNavigateToApiPage = () => {
      if(user?.plan === 'free') {
          setIsUpgradeModalOpen(true);
          return;
      }
      setPreviousView('dashboard');
      setView('developerApi');
  };

  const handleNavigateToPrivacyPolicy = () => {
      setPreviousView(authState === 'app' ? view : authState);
      setView('privacyPolicy');
  }
  
  const handleNavigateToPricing = () => {
      setPreviousView(view);
      setView('pricing');
  }

  const handleUpdateUser = (updatedUser: User) => {
    const fullUser = updateUserService(updatedUser);
    setUser(fullUser);
  };
  
  const handleWorkspaceSetup = (password: string, hint: string) => {
      if(user) {
        const updatedUser = { ...user, workspacePassword: password, workspaceHint: hint };
        const fullUser = updateUserService(updatedUser);
        setUser(fullUser);
        setView('workspace');
      }
  };

  const handleWorkspaceUnlock = (password: string): boolean => {
      if (password === "FINGERPRINT_SUCCESS" || user?.workspacePassword === password) {
          setView('workspace');
          return true;
      }
      return false;
  };

  const handleSaveToWorkspace = (summaryToSave: LegalSummary, notes: string) => {
    if (user && documentText && fileName) {
      const newDocument: SavedDocument = {
        fileName,
        summary: summaryToSave,
        documentText,
        savedAt: new Date().toISOString(),
        notes: notes,
        docType: documentOptions.docType,
        jurisdiction: documentOptions.jurisdiction,
      };
      const updatedUser = saveDocumentToWorkspace(user.email, newDocument);
      setUser(updatedUser);
      setNotification("Document saved to your workspace!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAttemptSendForSignature = () => {
    if (user?.plan === 'free') {
        setIsUpgradeModalOpen(true);
    } else {
        setIsSignatureModalOpen(true);
    }
  };
  
  const handleViewWorkspaceDocument = (doc: SavedDocument) => {
    setSummary(doc.summary);
    setFileName(doc.fileName);
    setDocumentText(doc.documentText);
    setDocumentOptions({ docType: doc.docType, jurisdiction: doc.jurisdiction });
    setPreviousView('workspace');
    setView('summary');
  }

  const handleLogin = (email: string, password: string): void => {
      setError(null);
      setNotification(null);
      const dbUser = getUserByEmail(email);
      if (dbUser && dbUser.password === password) {
          setUser(dbUser);
          setView('home');
          setAuthState('app');
      } else {
          setError("Invalid email or password. Please try again.");
      }
  };
  
  const handleSignupRequest = (fullName: string, email: string, password: string) => {
      clearAuthMessages();
      const lowerCaseEmail = email.toLowerCase();
      if (getUserByEmail(lowerCaseEmail)) {
          setError("An account with this email already exists.");
          return;
      }
      setPendingSignup({ fullName, email: lowerCaseEmail, password });
      console.log(`DEMO: Verification code for ${lowerCaseEmail} is 123456`); // Mock OTP for demo
      setAuthState('verifySignupCode');
  };

  const handleVerifySignup = (code: string) => {
      clearAuthMessages();
      if (code.length === 6 && /^\d+$/.test(code) && pendingSignup) {
          const newUser: Omit<StoredUser, 'savedDocuments' | 'workspacePassword' | 'workspaceHint'> = {
              ...pendingSignup,
              username: pendingSignup.fullName.split(' ')[0].toLowerCase() || 'newuser',
              age: 0,
              bio: 'New Verdicto user.',
              role: 'owner',
              plan: 'free',
              credits: 5,
          };
          const createdUser = createUser(newUser);
          setUser(createdUser);
          setPendingSignup(null);
          setView('home');
          setAuthState('app');
      } else {
          setError("Invalid verification code.");
      }
  };

  const handleLogout = () => {
    setUser(null);
    setView('home'); 
    setAuthState('intro');
  };

  const handleRequestPasswordReset = (email: string) => {
      setError(null);
      const lowerCaseEmail = email.toLowerCase();
      if (getUserByEmail(lowerCaseEmail)) {
          setEmailForReset(lowerCaseEmail);
          setAuthState('verifyCode');
      } else {
          setError("No account found with that email address.");
      }
  };

  const handleVerifyCode = (code: string) => {
      setError(null);
      // For demo, any 6-digit code is accepted
      if (code.length === 6 && /^\d+$/.test(code)) {
          setAuthState('resetPassword');
      } else {
          setError("Invalid verification code.");
      }
  };

  const handlePasswordUpdate = (newPassword: string) => {
      const userToUpdate = getUserByEmail(emailForReset);
      if(userToUpdate) {
        const updatedUser = { ...userToUpdate, password: newPassword };
        createUser(updatedUser); // createUser also works as an upsert
        setEmailForReset('');
        setNotification("Your password has been reset successfully. Please log in.");
        setAuthState('login');
      } else {
        // This case should ideally not happen if email validation is done correctly
        setError("An unexpected error occurred during password reset.");
        setAuthState('forgotPassword');
      }
  };
  
  const clearAuthMessages = () => {
    setError(null);
    setNotification(null);
  }

  const renderAppContent = () => {
    if (isLoading) {
      return <ProgressLoader step={progressStep} />;
    }

    if (error && !['home', 'workspaceUnlock', 'dashboard'].includes(view)) { 
      return (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Processing Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (view) {
      case 'pricing':
        return <PricingPage onBack={handleBack} />;
      case 'privacyPolicy':
        return <PrivacyPolicyPage onBack={handleBack} />;
      case 'developerApi':
        return user && <DeveloperApiPage user={user} onBack={handleBack} />;
      case 'summary':
        const savedDoc = user?.savedDocuments?.find(doc => doc.fileName === fileName && doc.summary.title === summary?.title);
        return summary && <SummaryPage 
            summary={summary} 
            fileName={fileName} 
            onBack={handleBack} 
            onSaveToWorkspace={handleSaveToWorkspace}
            onAttemptSendForSignature={handleAttemptSendForSignature}
            isSaved={!!savedDoc}
            initialNotes={savedDoc?.notes || ''}
        />;
      case 'dashboard':
        return user && <DashboardPage 
            user={user} 
            onUpdateUser={handleUpdateUser}
            onNavigateToWorkspace={handleNavigateToWorkspace}
            onNavigateToWorkspaceSetup={handleNavigateToWorkspaceSetup}
            onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
            onAttemptNavigateToApiPage={handleAttemptNavigateToApiPage}
            onNavigateToPricing={handleNavigateToPricing}
        />;
      case 'workspaceSetup':
        return <WorkspaceSetupPage 
            onSetupComplete={handleWorkspaceSetup} 
            onCancel={() => setView('dashboard')} 
            isReset={!!user?.workspacePassword}
        />;
      case 'workspaceUnlock':
        return <WorkspaceUnlockPage 
            onUnlock={handleWorkspaceUnlock} 
            hint={user?.workspaceHint || ''} 
            onGoHome={() => setView('home')} 
        />;
      case 'workspace':
        return <WorkspacePage 
            documents={user?.savedDocuments || []} 
            onViewDocument={handleViewWorkspaceDocument} 
            onGoHome={() => setView('home')} 
        />;
      case 'home':
      default:
        return <HomePage 
            onProcessDocument={handleDocumentProcess}
            onProcessExample={handleProcessExample}
            onProcessCloudFile={handleProcessCloudFile}
            user={user}
            onViewDocument={handleViewWorkspaceDocument}
        />;
    }
  };
  
  if (['privacyPolicy', 'developerApi', 'pricing'].includes(view)) {
    return (
        <div className="min-h-screen bg-brand-light text-brand-dark font-sans flex flex-col items-center justify-center p-4">
            <main className="flex-grow container mx-auto px-4 py-8 flex items-start justify-center">
             {view === 'privacyPolicy' ? <PrivacyPolicyPage onBack={handleBack} /> 
             : view === 'pricing' ? <PricingPage onBack={handleBack} />
             : user && <DeveloperApiPage user={user} onBack={handleBack} />}
            </main>
        </div>
    );
  }

  if (authState !== 'app') {
    let AuthComponent;
    switch(authState) {
        case 'splash':
            AuthComponent = <SplashPage onContinue={() => setAuthState('intro')} />;
            break;
        case 'login':
            AuthComponent = <LoginPage 
                onLogin={handleLogin} 
                onNavigateToSignup={() => { clearAuthMessages(); setAuthState('signup'); }} 
                onNavigateToForgotPassword={() => { clearAuthMessages(); setAuthState('forgotPassword'); }}
                onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
                error={error}
                notification={notification}
            />;
            break;
        case 'signup':
            AuthComponent = <SignupPage 
                onSignupRequest={handleSignupRequest} 
                onNavigateToLogin={() => { clearAuthMessages(); setAuthState('login'); }} 
                onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
                error={error}
            />;
            break;
        case 'verifySignupCode':
            AuthComponent = <VerifySignupPage 
                email={pendingSignup?.email || ''}
                onVerify={handleVerifySignup}
                onNavigateToLogin={() => { clearAuthMessages(); setAuthState('login'); }}
                error={error}
            />;
            break;
        case 'forgotPassword':
            AuthComponent = <ForgotPasswordPage 
                onResetRequest={handleRequestPasswordReset} 
                onNavigateToLogin={() => { clearAuthMessages(); setAuthState('login'); }} 
                error={error}
            />;
            break;
        case 'verifyCode':
            AuthComponent = <VerifyCodePage 
                email={emailForReset} 
                onVerify={handleVerifyCode} 
                onNavigateToLogin={() => { clearAuthMessages(); setAuthState('login'); }}
                error={error} 
            />;
            break;
        case 'resetPassword':
            AuthComponent = <ResetPasswordPage 
                onPasswordChange={handlePasswordUpdate} 
                onNavigateToLogin={() => { clearAuthMessages(); setAuthState('login'); }} 
            />;
            break;
        case 'intro':
        default:
            AuthComponent = <IntroPage 
                onNavigateToLogin={() => setAuthState('login')} 
                onNavigateToSignup={() => setAuthState('signup')}
                onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
            />;
            break;
    }
    return (
        <div className="min-h-screen bg-brand-light text-brand-dark font-sans flex flex-col items-center justify-center p-4">
            {AuthComponent}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans flex flex-col">
      <Header user={user} onLogout={handleLogout} onNavigateToHome={() => setView('home')} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToWorkspace={handleNavigateToWorkspace} onNavigateToPricing={handleNavigateToPricing} />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-start justify-center">
        {notification && (
            <div className="fixed top-24 right-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in" role="alert">
                <span className="block sm:inline">{notification}</span>
            </div>
        )}
        {renderAppContent()}
      </main>
      {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={() => { setIsUpgradeModalOpen(false); handleNavigateToPricing(); }} />}
      {isSignatureModalOpen && <ESignatureModal fileName={fileName} onClose={() => setIsSignatureModalOpen(false)} />}
      <Chatbot documentContext={documentText} />
    </div>
  );
};

export default App;
