import React from 'react';
import type { User, StoredUser } from '../types';
import { UserProfile } from './UserProfile';
import { FolderLock, Key, ShieldCheck, Code, Star, CheckCircle } from './icons';

interface DashboardPageProps {
  user: StoredUser;
  onUpdateUser: (user: User) => void;
  onNavigateToWorkspace: () => void;
  onNavigateToWorkspaceSetup: () => void;
  onNavigateToPrivacyPolicy: () => void;
  onAttemptNavigateToApiPage: () => void;
  onNavigateToPricing: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onUpdateUser, onNavigateToWorkspace, onNavigateToWorkspaceSetup, onNavigateToPrivacyPolicy, onAttemptNavigateToApiPage, onNavigateToPricing }) => {
  const isWorkspaceSetup = !!user.workspacePassword;

  // Fix: Added a check for user.plan to prevent the "Cannot read properties of undefined" error.
  const planName = user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free';

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-primary mb-6">User Dashboard</h1>
        <UserProfile user={user} onUpdateUser={onUpdateUser} />
      </div>

       <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">My Workspace</h2>
        {isWorkspaceSetup ? (
          <div className="space-y-4">
            <p className="text-gray-600">Your secure workspace is set up. You can access your saved documents or change your workspace password.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
               <button
                onClick={onNavigateToWorkspace}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
              >
                <FolderLock className="w-5 h-5" />
                <span>Go to Workspace</span>
              </button>
               <button
                onClick={onNavigateToWorkspaceSetup}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors"
              >
                <Key className="w-5 h-5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Create a secure, password-protected workspace to save and manage your document summaries.</p>
            <div className="pt-2">
               <button
                onClick={onNavigateToWorkspaceSetup}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-brand-secondary text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
              >
                <FolderLock className="w-5 h-5" />
                <span>Set Up Secure Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">My Subscription</h2>
          <div className="flex-grow space-y-4 flex flex-col">
              <div className="flex-grow flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                <Star className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-brand-dark">{planName} Plan</h3>
                    {user.plan === 'free' ? (
                        <p className="text-gray-600 mt-1 text-sm">You have <strong>{user.credits}</strong> analysis credits remaining.</p>
                    ) : (
                        <p className="text-gray-600 mt-1 text-sm">Your plan includes unlimited analyses and all premium features.</p>
                    )}
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={onNavigateToPricing}
                  className="font-medium text-brand-primary hover:text-blue-800 transition-colors"
                >
                  View Plans &amp; Upgrade
                </button>
              </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Security & Privacy</h2>
          <div className="flex-grow space-y-4 flex flex-col">
              <div className="flex-grow flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-brand-primary flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-brand-dark">Your Data is Secure</h3>
                    <p className="text-gray-600 mt-1 text-sm">Your data is encrypted and stored only on your device.</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={onNavigateToPrivacyPolicy}
                  className="font-medium text-brand-primary hover:text-blue-800 transition-colors"
                >
                  View our full Privacy Policy
                </button>
              </div>
            </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">Developer API</h2>
        <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Code className="w-8 h-8 text-brand-dark flex-shrink-0 mt-1" />
              <div>
                  <h3 className="font-bold text-brand-dark">Integrate Verdicto</h3>
                  <p className="text-gray-600 mt-1 text-sm">Use our API to embed document analysis in your own tools. {user.plan === 'free' && ' (Pro feature)'}</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onAttemptNavigateToApiPage}
                className="font-medium text-brand-primary hover:text-blue-800 transition-colors"
              >
                Get Your API Key
              </button>
            </div>
          </div>
      </div>

    </div>
  );
};
