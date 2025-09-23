import React, { useState } from 'react';
import { Gavel, Lock, AlertTriangle } from './icons';

interface ResetPasswordPageProps {
  onPasswordChange: (newPassword: string) => void;
  onNavigateToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onPasswordChange, onNavigateToLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }
    setError(null);
    onPasswordChange(newPassword);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="text-center mb-8">
            <Gavel className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-brand-primary">
                Reset Your Password
            </h1>
            <p className="text-gray-500 mt-2">Please choose a new, secure password.</p>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new-password" className="text-sm font-bold text-gray-700 tracking-wide">New Password</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
                />
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm font-bold text-gray-700 tracking-wide">Confirm New Password</label>
            <div className="relative mt-1">
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
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
              Set New Password
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-sm text-gray-600">
          <button onClick={onNavigateToLogin} className="font-medium text-brand-secondary hover:text-green-500">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};
