import React from 'react';

interface AuthFooterProps {
    onNavigateToPrivacyPolicy: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ onNavigateToPrivacyPolicy }) => {
    return (
        <footer className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Verdicto. All rights reserved.</p>
            <button 
                onClick={onNavigateToPrivacyPolicy} 
                className="font-medium text-brand-primary hover:text-blue-800 underline"
            >
                Privacy Policy
            </button>
        </footer>
    )
}
