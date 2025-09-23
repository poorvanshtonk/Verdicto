import React, { useState } from 'react';
import { FolderLock, Lock, AlertTriangle, ArrowLeft } from './icons';
import { FingerprintScanner } from './FingerprintScanner';

interface WorkspaceUnlockPageProps {
  onUnlock: (password: string) => boolean;
  hint: string;
  onGoHome: () => void;
}

export const WorkspaceUnlockPage: React.FC<WorkspaceUnlockPageProps> = ({ onUnlock, hint, onGoHome }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(password);
    if (!success) {
      setError("Incorrect password. Please try again.");
    } else {
        setError(null);
    }
  };
  
  const handleScanComplete = (success: boolean) => {
      if (success) {
        // For this demo, we use a special key to signify a successful fingerprint scan,
        // as we can't truly verify a fingerprint on the frontend.
        onUnlock("FINGERPRINT_SUCCESS");
      }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
            <FolderLock className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-primary">
                Workspace Locked
            </h1>
            <p className="text-gray-500 mt-2">Enter your password or use your fingerprint to unlock.</p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="ws-unlock-password" className="text-sm font-bold text-gray-700 tracking-wide">Workspace Password</label>
                    {hint && <span className="text-xs text-gray-500">Hint: {hint}</span>}
                </div>
                <div className="relative mt-1">
                    <div className="absolute top-1/2 left-3 -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        id="ws-unlock-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter workspace password"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
            </div>
            <div>
                <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300"
                >
                Unlock
                </button>
            </div>
        </form>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <FingerprintScanner onScanComplete={handleScanComplete} />
        
        <p className="mt-6 text-center text-sm text-gray-600">
          <button onClick={onGoHome} className="font-medium text-brand-secondary hover:text-green-500 flex items-center justify-center gap-1 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
};
