import React, { useState } from 'react';
import { X, Send, FileText, AtSign, CheckCircle } from './icons';

interface ESignatureModalProps {
    fileName: string;
    onClose: () => void;
}

type Stage = 'prepare' | 'sent';

export const ESignatureModal: React.FC<ESignatureModalProps> = ({ fileName, onClose }) => {
    const [stage, setStage] = useState<Stage>('prepare');
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            setStage('sent');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">Send for Signature</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {stage === 'prepare' ? (
                    <form onSubmit={handleSend}>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                This will start a (simulated) e-signature process for the document:
                            </p>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                <FileText className="w-6 h-6 text-brand-primary flex-shrink-0" />
                                <span className="font-semibold text-brand-dark">{fileName}</span>
                            </div>
                            <div>
                                <label htmlFor="recipient-email" className="text-sm font-bold text-gray-700">Recipient's Email</label>
                                 <div className="relative mt-1">
                                    <div className="absolute top-1/2 left-3 -translate-y-1/2">
                                        <AtSign className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="recipient-email"
                                        type="email"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        placeholder="signer@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="message" className="text-sm font-bold text-gray-700">Message (Optional)</label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please review and sign this document..."
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                             <p className="text-xs text-center text-gray-400">Powered by a simulated e-signature service.</p>
                        </div>
                        <footer className="p-4 border-t flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                             <button
                                type="submit"
                                disabled={isSending}
                                className="px-6 py-2 flex items-center gap-2 text-white font-semibold rounded-lg transition-colors bg-brand-secondary hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {isSending ? (
                                    <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send
                                    </>
                                )}
                            </button>
                        </footer>
                    </form>
                ) : (
                    <div className="p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-brand-dark">Request Sent!</h3>
                        <p className="text-gray-600 mt-2">A signature request for <strong>{fileName}</strong> has been sent to <strong>{recipient}</strong>.</p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
