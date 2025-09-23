import React, { useState } from 'react';
import { Gavel, AtSign, Lock, CheckCircle, AlertTriangle } from './icons';
import { AuthFooter } from './AuthFooter';

interface LoginPageProps {
  onLogin: (email: string, password:string) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToPrivacyPolicy: () => void;
  error: string | null;
  notification: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onNavigateToForgotPassword, onNavigateToPrivacyPolicy, error, notification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-primary">
            Welcome Back
            </h1>
            <p className="text-gray-500">Log in to continue to Verdicto.</p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {notification && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{notification}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
                />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
                <label htmlFor="password-login" className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
                <button 
                    type="button" 
                    onClick={onNavigateToForgotPassword} 
                    className="text-sm font-medium text-brand-primary hover:text-blue-800"
                >
                    Forgot password?
                </button>
            </div>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
                />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300"
            >
              Log In
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignup} className="font-medium text-brand-secondary hover:text-green-500">
            Sign up
          </button>
        </p>
      </div>
      <AuthFooter onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy} />
    </div>
  );
};
