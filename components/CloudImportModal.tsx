import React, { useState } from 'react';
import { X, GoogleDrive, Dropbox, OneDrive, FileText } from './icons';

interface CloudImportModalProps {
  onClose: () => void;
  onFileSelect: (fileName: string) => void;
}

type CloudService = 'gdrive' | 'dropbox' | 'onedrive';

const fakeFiles: Record<CloudService, { name: string; type: string; date: string }[]> = {
    gdrive: [
        { name: "Project Alpha NDA.pdf", type: "PDF", date: "Jan 15, 2024" },
        { name: "Vendor Agreement Q4.pdf", type: "PDF", date: "Dec 10, 2023" },
        { name: "Employment Contract Template.pdf", type: "PDF", date: "Nov 22, 2023" },
    ],
    dropbox: [
        { name: "Investment_Terms_v2.pdf", type: "PDF", date: "Feb 01, 2024" },
        { name: "Client_MSA_Draft.pdf", type: "PDF", date: "Jan 20, 2024" },
    ],
    onedrive: [
        { name: "LeaseAgreement_Office.pdf", type: "PDF", date: "Dec 05, 2023" },
        { name: "ServiceLevelAgreement.pdf", type: "PDF", date: "Nov 18, 2023" },
        { name: "SupplierContract.pdf", type: "PDF", date: "Oct 30, 2023" },
    ]
};

const ServiceButton: React.FC<{
    service: CloudService,
    activeService: CloudService,
    onClick: (service: CloudService) => void,
    children: React.ReactNode
}> = ({ service, activeService, onClick, children }) => {
    const isActive = service === activeService;
    return (
        <button
            onClick={() => onClick(service)}
            className={`flex-1 flex items-center justify-center gap-3 p-3 border-b-2 font-semibold transition-colors ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
        >
            {children}
        </button>
    )
}

export const CloudImportModal: React.FC<CloudImportModalProps> = ({ onClose, onFileSelect }) => {
    const [activeService, setActiveService] = useState<CloudService>('gdrive');
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-dark">Import from Cloud</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex border-b">
                    <ServiceButton service="gdrive" activeService={activeService} onClick={setActiveService}>
                        <GoogleDrive className="w-5 h-5" /> Google Drive
                    </ServiceButton>
                    <ServiceButton service="dropbox" activeService={activeService} onClick={setActiveService}>
                        <Dropbox className="w-5 h-5" /> Dropbox
                    </ServiceButton>
                    <ServiceButton service="onedrive" activeService={activeService} onClick={setActiveService}>
                        <OneDrive className="w-5 h-5" /> OneDrive
                    </ServiceButton>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-4 text-center">Select a document to analyze. (This is a simulation)</p>
                    <ul className="space-y-2">
                        {fakeFiles[activeService].map((file, index) => (
                            <li key={index}>
                                <button 
                                    onClick={() => onFileSelect(file.name)}
                                    className="w-full flex items-center gap-4 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <FileText className="w-6 h-6 text-brand-primary flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-brand-dark">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.type} - Modified: {file.date}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-brand-secondary">Select</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                 <footer className="p-4 border-t text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};
