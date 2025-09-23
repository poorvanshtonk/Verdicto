import React from 'react';
import { ArrowLeft, ShieldCheck } from './icons';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-brand-dark mb-3">{title}</h2>
    <div className="space-y-3 text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 mb-6 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
        </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8 border-b pb-6">
            <ShieldCheck className="w-16 h-16 text-brand-primary mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-brand-primary">
                Privacy Policy
            </h1>
            <p className="text-gray-500 mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="prose max-w-none">
            <p className="lead text-lg text-gray-600 mb-6">Your privacy is critically important to us. Verdicto is designed with a "local-first" philosophy to ensure your data remains secure and under your control.</p>

            <Section title="1. Data Storage and Encryption">
                <p>
                    <strong>Local-First Principle:</strong> All of your personal data, including your user profile, saved documents, summaries, and notes, is stored directly on your device in your web browser's local storage. This data is <strong>never</strong> uploaded to or stored on any Verdicto servers.
                </p>
                <p>
                    <strong>At-Rest Encryption:</strong> To provide an additional layer of security, all the data we store in your browser's local storage is encrypted. This means that even if someone gained access to your device's storage, the data would not be readable in plain text.
                </p>
            </Section>

            <Section title="2. Document Processing and AI">
                <p>
                    When you upload a document for analysis, the following process occurs:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>The document is processed entirely within your browser to extract its text content.</li>
                    <li>Only the extracted text is sent to the Google Gemini API for summarization and analysis. Your original file never leaves your computer.</li>
                    <li>The analysis received from the API is then displayed to you. If you choose to save it, it is stored encrypted in your local browser storage.</li>
                </ol>
                <p>
                    We do not log, monitor, or store the content of the documents you process. Your interaction with the Google Gemini API is subject to Google's Privacy Policy and Terms of Service.
                </p>
            </Section>

            <Section title="3. User Accounts">
                <p>
                    Your user account information (name, email, encrypted password) is also stored locally on your device. This allows the application to function without needing a traditional backend server, further enhancing your privacy.
                </p>
            </Section>

            <Section title="4. Cookies and Tracking">
                <p>
                   Verdicto does not use any third-party tracking cookies or analytics services. We only use essential local storage to make the application function.
                </p>
            </Section>

            <Section title="5. Changes to This Policy">
                 <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
            </Section>
        </div>
      </div>
    </div>
  );
};
