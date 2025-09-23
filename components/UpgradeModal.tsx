import React from 'react';
import { X, Star, CheckCircle } from './icons';

interface UpgradeModalProps {
    onClose: () => void;
    onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <header className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500" />
                        Upgrade to Pro
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        This is a premium feature. Upgrade to the Pro plan to unlock this and much more.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-secondary" />
                            <span>Unlimited Document Analyses</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-secondary" />
                            <span>E-Signature Integration</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-secondary" />
                            <span>Developer API Access</span>
                        </li>
                         <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-brand-secondary" />
                            <span>Priority Support</span>
                        </li>
                    </ul>
                     <button
                        onClick={onUpgrade}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-brand-secondary text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                    >
                        View Plans & Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};
