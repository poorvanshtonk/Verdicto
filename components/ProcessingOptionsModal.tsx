import React, { useState, useRef } from 'react';
import { X, FileUp, FileText } from './icons';

interface ProcessingOptionsModalProps {
  onClose: () => void;
  onProcess: (file: File, docType: string, jurisdiction: string) => void;
}

const docTypes = ["General", "Non-Disclosure Agreement", "Employment Contract", "Lease Agreement", "Terms of Service"];
const jurisdictions = ["General / International", "USA", "United Kingdom", "India"];

export const ProcessingOptionsModal: React.FC<ProcessingOptionsModalProps> = ({ onClose, onProcess }) => {
    const [docType, setDocType] = useState(docTypes[0]);
    const [jurisdiction, setJurisdiction] = useState(jurisdictions[0]);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (file) {
            onProcess(file, docType, jurisdiction);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">Processing Options</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-600">
                        Providing context helps the AI deliver a more accurate analysis.
                    </p>
                    
                    <div>
                        <label htmlFor="doc-type" className="text-sm font-bold text-gray-700">Document Type</label>
                        <select
                            id="doc-type"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="jurisdiction" className="text-sm font-bold text-gray-700">Jurisdiction</label>
                         <select
                            id="jurisdiction"
                            value={jurisdiction}
                            onChange={(e) => setJurisdiction(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-700">Upload Your Document</label>
                        {file ? (
                             <div className="mt-2 flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="w-6 h-6 text-brand-primary flex-shrink-0" />
                                    <span className="font-semibold text-brand-dark truncate">{file.name}</span>
                                </div>
                                <button onClick={() => setFile(null)} className="text-sm font-medium text-red-600 hover:text-red-800 flex-shrink-0">
                                    Remove
                                </button>
                            </div>
                        ) : (
                             <button
                                onClick={handleUploadClick}
                                className="w-full mt-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-brand-primary hover:text-brand-primary transition-colors"
                            >
                                <FileUp className="w-8 h-8" />
                                <span className="font-semibold">Click to upload a PDF file</span>
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf"
                        />
                    </div>
                </div>

                <footer className="p-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file}
                        className="px-6 py-2 flex items-center gap-2 text-white font-semibold rounded-lg transition-colors bg-brand-primary hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Analyze Document
                    </button>
                </footer>
            </div>
        </div>
    );
};
