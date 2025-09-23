import React, { useState } from 'react';
import type { StoredUser } from '../types';
import { ArrowLeft, Code, ClipboardList, CheckCircle } from './icons';

interface DeveloperApiPageProps {
  user: StoredUser;
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-brand-dark mb-4 pb-2 border-b-2 border-brand-primary">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

const CodeSnippet: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{language}</span>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-dark"
                >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500"/> : <ClipboardList className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto bg-gray-50"><code className="text-gray-900">{code}</code></pre>
        </div>
    );
}

export const DeveloperApiPage: React.FC<DeveloperApiPageProps> = ({ user, onBack }) => {
    // Generate a simple, deterministic "API key" based on user email for demo purposes
    const apiKey = `vd-live-${btoa(user.email).substring(0, 28)}`;

    const curlExample = `curl -X POST 'https://api.verdicto.ai/v1/summarize' \\
-H 'Authorization: Bearer ${apiKey}' \\
-H 'Content-Type: application/json' \\
-d '{
  "documentText": "This is the full text of the legal document..."
}'`;

    const jsExample = `const documentText = "This is the full text of the legal document...";

fetch('https://api.verdicto.ai/v1/summarize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ documentText })
})
.then(response => response.json())
.then(data => console.log(data.summary))
.catch(error => console.error('Error:', error));`;


    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-10 border-b pb-6">
                    <Code className="w-16 h-16 text-brand-primary mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold text-brand-primary">
                        Developer API
                    </h1>
                    <p className="text-gray-500 mt-2">Integrate Verdicto's powerful document analysis into your applications.</p>
                </div>

                <Section title="Your API Key">
                    <p>Use this key in the `Authorization` header of your API requests.</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg font-mono text-sm">
                        <span className="flex-grow">{apiKey}</span>
                        <button
                            onClick={() => navigator.clipboard.writeText(apiKey)}
                            className="flex-shrink-0 text-brand-primary hover:text-blue-800"
                            aria-label="Copy API Key"
                        >
                            <ClipboardList className="w-5 h-5" />
                        </button>
                    </div>
                     <p className="text-xs text-gray-500">Keep your API key secure and do not share it publicly.</p>
                </Section>
                
                <Section title="API Usage">
                     <p>Your current plan includes 1,000 free API calls per month.</p>
                     <div className="w-full bg-gray-200 rounded-full h-4">
                         <div className="bg-brand-secondary h-4 rounded-full" style={{width: '5%'}}></div>
                     </div>
                     <p className="text-sm text-gray-600">50 / 1,000 calls used this month.</p>
                </Section>

                <Section title="Example Request">
                    <p>Here’s how to make a request to the summarization endpoint. The API will return a JSON object with the same structure as the summary page.</p>
                    <CodeSnippet language="cURL (Bash)" code={curlExample} />
                    <CodeSnippet language="JavaScript (Fetch)" code={jsExample} />
                </Section>
            </div>
        </div>
    );
};
