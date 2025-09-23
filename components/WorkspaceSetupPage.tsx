import React, { useState } from 'react';
import { FolderLock, Lock, AlertTriangle, ArrowLeft } from './icons';
import { FingerprintScanner } from './FingerprintScanner';

interface WorkspaceSetupPageProps {
  onSetupComplete: (password: string, hint: string) => void;
  onCancel: () => void;
  isReset?: boolean;
}

type Step = 1 | 2;

export const WorkspaceSetupPage: React.FC<WorkspaceSetupPageProps> = ({ onSetupComplete, onCancel, isReset = false }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }
    setError(null);
    setStep(2);
  };
  
  const handleScanComplete = (success: boolean) => {
      if (success) {
          onSetupComplete(password, hint);
      }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
            <FolderLock className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-primary">
                {isReset ? 'Change Workspace Password' : 'Secure Your Workspace'}
            </h1>
            <p className="text-gray-500 mt-2">
                {isReset ? "Enter a new password for your personal document vault." : 
                 step === 1 ? "Create a unique password for your personal document vault." : "Register your fingerprint for quick access."}
            </p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        {step === 1 ? (
             <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label htmlFor="ws-password" className="text-sm font-bold text-gray-700 tracking-wide">New Workspace Password</label>
                    <div className="relative mt-1">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            id="ws-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8+ characters"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="ws-confirm-password" className="text-sm font-bold text-gray-700 tracking-wide">Confirm Password</label>
                    <div className="relative mt-1">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            id="ws-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="ws-hint" className="text-sm font-bold text-gray-700 tracking-wide">Password Hint (Optional)</label>
                     <input
                        id="ws-hint"
                        type="text"
                        value={hint}
                        onChange={(e) => setHint(e.target.value)}
                        placeholder="e.g., My first pet's name"
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div className="pt-2">
                    <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300"
                    >
                    Continue to Fingerprint Setup
                    </button>
                </div>
            </form>
        ) : (
            <div className="animate-fade-in">
                <FingerprintScanner onScanComplete={handleScanComplete} statusText="Place finger to register" />
            </div>
        )}
        
        <p className="mt-6 text-center text-sm text-gray-600">
          <button onClick={onCancel} className="font-medium text-brand-secondary hover:text-green-500 flex items-center justify-center gap-1 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </p>
      </div>
    </div>
  );
};
