import React, { useState } from 'react';
import { Gavel, AlertTriangle } from './icons';

interface VerifyCodePageProps {
  email: string;
  onVerify: (code: string) => void;
  onNavigateToLogin: () => void;
  error: string | null;
}

export const VerifyCodePage: React.FC<VerifyCodePageProps> = ({ email, onVerify, onNavigateToLogin, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      onVerify(code);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-primary">
                Check Your Email
            </h1>
            <p className="text-gray-500 mt-2">We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below.</p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="verify-code" className="text-sm font-bold text-gray-700 tracking-wide">Verification Code</label>
            <input
              id="verify-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
              maxLength={6}
              className="w-full text-center tracking-[0.5em] font-mono text-lg mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300"
            >
              Verify & Proceed
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Entered the wrong email?{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-brand-secondary hover:text-green-500">
            Go Back
          </button>
        </p>
      </div>
    </div>
  );
};
