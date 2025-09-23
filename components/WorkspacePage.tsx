import React from 'react';
import type { SavedDocument } from '../types';
import { FolderLock, FileText, ArrowLeft } from './icons';

interface WorkspacePageProps {
  documents: SavedDocument[];
  onViewDocument: (doc: SavedDocument) => void;
  onGoHome: () => void;
}

const DocumentItem: React.FC<{ document: SavedDocument; onClick: () => void; }> = ({ document, onClick }) => {
    const savedDate = new Date(document.savedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    return (
        <button 
            onClick={onClick}
            className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-left"
        >
            <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-brand-primary flex-shrink-0" />
                <div>
                    <p className="font-semibold text-brand-dark truncate">{document.fileName}</p>
                    <p className="text-sm text-gray-500">Saved on {savedDate}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{document.docType}</span>
                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">{document.jurisdiction}</span>
                    </div>
                </div>
            </div>
            <span className="text-sm font-semibold text-brand-secondary mt-3 sm:mt-0">View Summary</span>
        </button>
    )
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ documents, onViewDocument, onGoHome }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <button onClick={onGoHome} className="flex items-center gap-2 mb-6 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
        </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8 border-b pb-6">
            <FolderLock className="w-16 h-16 text-brand-primary mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-brand-primary">
                My Workspace
            </h1>
            <p className="text-gray-500 mt-2">Your secure vault for all saved document analyses.</p>
        </div>
        
        {documents.length > 0 ? (
            <div className="space-y-4">
                {documents.sort((a,b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).map((doc, index) => (
                    <DocumentItem key={index} document={doc} onClick={() => onViewDocument(doc)} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-600">Your workspace is empty.</p>
                <p className="text-sm text-gray-500 mt-2">Analyze a new document and click "Save to Workspace" on the summary page to add it here.</p>
            </div>
        )}
      </div>
    </div>
  );
};
