import React, { useState, useRef } from 'react';
import { QrScannerModal } from './QrScannerModal';
import { FileUp, QrCode, FileText, Gavel, Cloud } from './icons';
import type { StoredUser, SavedDocument } from '../types';
import { CloudImportModal } from './CloudImportModal';
import { ProcessingOptionsModal } from './ProcessingOptionsModal';

interface HomePageProps {
  onProcessDocument: (file: File, docType: string, jurisdiction: string) => void;
  onProcessExample: () => void;
  onProcessCloudFile: (fileName: string) => void;
  user: StoredUser | null;
  onViewDocument: (doc: SavedDocument) => void;
}

const DocumentItem: React.FC<{ document: SavedDocument; onClick: () => void; }> = ({ document, onClick }) => {
    const savedDate = new Date(document.savedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-left"
        >
            <div className="flex items-center gap-4 overflow-hidden">
                <FileText className="w-6 h-6 text-brand-primary flex-shrink-0" />
                <div>
                    <p className="font-semibold text-brand-dark truncate">{document.fileName}</p>
                    <p className="text-sm text-gray-500">Saved: {savedDate}</p>
                </div>
            </div>
            <span className="text-sm font-semibold text-brand-secondary flex-shrink-0 ml-4">View Summary</span>
        </button>
    )
}

export const HomePage: React.FC<HomePageProps> = ({ onProcessDocument, onProcessExample, onProcessCloudFile, user, onViewDocument }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const handleQrScanSuccess = (decodedText: string) => {
    console.log(`Scanned QR Code URL: ${decodedText}`);
    alert(`QR code scanned successfully. Document fetching from URL is not implemented in this demo. Please upload a document manually.`);
    setIsScannerOpen(false);
  };
  
  const handleCloudFileSelect = (fileName: string) => {
      setIsCloudModalOpen(false);
      onProcessCloudFile(fileName);
  }

  const handleProcessWithOptions = (file: File, docType: string, jurisdiction: string) => {
    setIsOptionsModalOpen(false);
    onProcessDocument(file, docType, jurisdiction);
  }
  
  const handleUploadClick = () => {
    if (user?.plan === 'free' && (user.credits ?? 0) <= 0) {
        alert("You have run out of free analysis credits. Please upgrade to the Pro plan for unlimited analyses.");
        return;
    }
    setIsOptionsModalOpen(true);
  };

  const savedDocuments = user?.savedDocuments || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-2">
          Hello, {user?.fullName ? user.fullName.split(' ')[0] : 'User'}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI-powered legal analysis in seconds, not days. Ready to begin?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            <FileUp className="w-6 h-6" />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => setIsCloudModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            <Cloud className="w-6 h-6" />
            <span>Import from Cloud</span>
          </button>
           <button
            onClick={onProcessExample}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-secondary text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          >
            <Gavel className="w-6 h-6" />
            <span>Try an Example</span>
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-blue-50 transition-all duration-300"
          >
            <QrCode className="w-6 h-6" />
            <span>Scan QR Code</span>
          </button>
        </div>
      </div>
      
      {savedDocuments.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Your Saved Documents</h2>
              <div className="space-y-4">
                  {savedDocuments
                    .sort((a,b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
                    .slice(0, 5) // Show latest 5
                    .map((doc, index) => (
                      <DocumentItem key={index} document={doc} onClick={() => onViewDocument(doc)} />
                  ))}
              </div>
          </div>
      )}

      {isScannerOpen && (
        <QrScannerModal
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleQrScanSuccess}
        />
      )}
      {isCloudModalOpen && (
        <CloudImportModal
            onClose={() => setIsCloudModalOpen(false)}
            onFileSelect={handleCloudFileSelect}
        />
      )}
      {isOptionsModalOpen && (
          <ProcessingOptionsModal 
            onClose={() => setIsOptionsModalOpen(false)}
            onProcess={handleProcessWithOptions}
          />
      )}
    </div>
  );
};
