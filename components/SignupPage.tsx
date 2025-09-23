import React, { useState } from 'react';
import { Gavel, User, AtSign, Lock, AlertTriangle } from './icons';
import { AuthFooter } from './AuthFooter';

interface SignupPageProps {
  onSignupRequest: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToPrivacyPolicy: () => void;
  error: string | null;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignupRequest, onNavigateToLogin, onNavigateToPrivacyPolicy, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
     if (password.length < 8) {
        setLocalError("Password must be at least 8 characters long.");
        return;
    }

    onSignupRequest(name, email, password);
  };

  const displayError = error || localError;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <Gavel className="w-12 h-12 text-brand-primary mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-brand-primary">
            Create an Account
          </h1>
          <p className="text-gray-500">Join Verdicto and gain legal clarity.</p>
        </div>
        {displayError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{displayError}</span>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-gray-700 tracking-wide">Full Name</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email-signup" className="text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <AtSign className="w-5 h-5 text-gray-400" />
                </div>
              <input
                id="email-signup"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password-signup" className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
              <input
                id="password-signup"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
              />
            </div>
          </div>
           <div>
            <label htmlFor="confirm-password-signup" className="text-sm font-bold text-gray-700 tracking-wide">Confirm Password</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
              <input
                id="confirm-password-signup"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-secondary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-brand-secondary hover:text-green-500">
            Log in
          </button>
        </p>
      </div>
      <AuthFooter onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy} />
    </div>
  );
};
