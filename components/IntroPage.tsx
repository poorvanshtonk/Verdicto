import React from 'react';
import { Gavel } from './icons';
import { AuthFooter } from './AuthFooter';

interface IntroPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
  onNavigateToPrivacyPolicy: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onNavigateToLogin, onNavigateToSignup, onNavigateToPrivacyPolicy }) => {
  return (
    <div className="text-center max-w-2xl w-full">
      <div className="bg-white p-10 rounded-2xl shadow-xl animate-fade-in">
        <Gavel className="w-20 h-20 text-brand-primary mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-brand-primary mb-4">
          Verdicto
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Your AI-powered legal assistant. Demystify complex documents, understand your rights, and gain clarity with confidence.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={onNavigateToSignup}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-secondary text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
          <button
            onClick={onNavigateToLogin}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
        </div>
      </div>
       <AuthFooter onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy} />
    </div>
  );
};
