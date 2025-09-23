import React, { useState, useEffect } from 'react';
import type { LegalSummary, ExtractedClause } from '../types';
import { CheckCircle, AlertTriangle, Gavel, FileText, ArrowLeft, Printer, ClipboardList, ChevronDown, Save, Send, Pencil } from './icons';

interface SummaryPageProps {
  summary: LegalSummary;
  fileName: string;
  onBack: () => void;
  onSaveToWorkspace?: (summary: LegalSummary, notes: string) => void;
  onAttemptSendForSignature: () => void;
  isSaved?: boolean;
  initialNotes?: string;
}

type TabKey = 'summary' | 'benefitsRisks' | 'authorities' | 'clauses';

const SummarySection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-2xl font-bold text-brand-dark ml-3">{title}</h2>
        </div>
        {children}
    </div>
);

const BulletList: React.FC<{ items: string[]; itemClassName: string }> = ({ items, itemClassName }) => (
    <ul className="space-y-3">
        {items.map((item, index) => (
            <li key={index} className={`flex items-start ${itemClassName}`}>
                <span className="font-bold text-lg mr-3 mt-1">&#8226;</span>
                <span className="flex-1">{item}</span>
            </li>
        ))}
    </ul>
);

const ClauseAccordionItem: React.FC<{ 
    clause: ExtractedClause; 
    isOpen: boolean; 
    onClick: () => void; 
    onEdit: () => void;
    isEditing: boolean;
    onSaveEdit: (updatedClause: ExtractedClause) => void;
    onCancelEdit: () => void;
}> = ({ clause, isOpen, onClick, onEdit, isEditing, onSaveEdit, onCancelEdit }) => {
    const [editedClause, setEditedClause] = useState(clause);

    useEffect(() => {
        setEditedClause(clause);
    }, [clause]);

    const handleSave = () => {
        onSaveEdit(editedClause);
    }
    
    if (isEditing) {
        return (
             <div className="border-b last:border-b-0 p-4 bg-blue-50/50">
                <input 
                    type="text"
                    value={editedClause.clauseTitle}
                    onChange={(e) => setEditedClause({...editedClause, clauseTitle: e.target.value})}
                    className="font-semibold text-lg text-brand-dark w-full p-2 border rounded-md mb-2"
                />
                <textarea 
                    value={editedClause.clauseText}
                    onChange={(e) => setEditedClause({...editedClause, clauseText: e.target.value})}
                    rows={6}
                    className="w-full p-2 border rounded-md bg-white text-gray-700 leading-relaxed"
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={onCancelEdit} className="px-3 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-brand-secondary text-white font-semibold rounded-md hover:bg-green-600">Save</button>
                </div>
            </div>
        )
    }

    return (
        <div className="border-b last:border-b-0">
            <div className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50 transition-colors rounded-md group">
                <button onClick={onClick} className="flex-grow flex items-center justify-between">
                    <span className="font-semibold text-lg text-brand-dark">{clause.clauseTitle}</span>
                    <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={onEdit} className="ml-4 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:bg-gray-200 hover:text-brand-primary">
                    <Pencil className="w-4 h-4" />
                </button>
            </div>
            {isOpen && (
                <div className="p-4 bg-gray-50 text-gray-700 leading-relaxed animate-fade-in rounded-md">
                    <p className="whitespace-pre-wrap">{clause.clauseText}</p>
                </div>
            )}
        </div>
    )
}


export const SummaryPage: React.FC<SummaryPageProps> = ({ summary, fileName, onBack, onSaveToWorkspace, onAttemptSendForSignature, isSaved, initialNotes = '' }) => {
    const [editableSummary, setEditableSummary] = useState<LegalSummary>(summary);
    const [openClauseIndex, setOpenClauseIndex] = useState<number | null>(null);
    const [editingClauseIndex, setEditingClauseIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>('summary');
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setEditableSummary(summary);
    }, [summary]);
    
    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);


    const handleClauseToggle = (index: number) => {
        if (editingClauseIndex !== null) return;
        setOpenClauseIndex(openClauseIndex === index ? null : index);
    };
    
    const handleEditClause = (index: number) => {
        setEditingClauseIndex(index);
        setOpenClauseIndex(null); // Close accordion when editing
    }
    
    const handleSaveClauseEdit = (updatedClause: ExtractedClause) => {
        if (editingClauseIndex !== null) {
            const newClauses = [...editableSummary.extractedClauses];
            newClauses[editingClauseIndex] = updatedClause;
            setEditableSummary({ ...editableSummary, extractedClauses: newClauses });
            setEditingClauseIndex(null);
        }
    }
    
    const handleCancelClauseEdit = () => {
        setEditingClauseIndex(null);
    }

    const handlePrint = () => {
        window.print();
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'summary':
                return (
                    <SummarySection title="Concise Summary" icon={<FileText className="w-7 h-7 text-brand-primary" />}>
                        <p className="text-gray-700 leading-relaxed">{editableSummary.summary}</p>
                    </SummarySection>
                );
            case 'benefitsRisks':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <SummarySection title="Key Benefits" icon={<CheckCircle className="w-7 h-7 text-green-500" />} className="h-full">
                            <BulletList items={editableSummary.benefits} itemClassName="text-green-800" />
                        </SummarySection>
                        <SummarySection title="Potential Risks" icon={<AlertTriangle className="w-7 h-7 text-red-500" />} className="h-full">
                            <BulletList items={editableSummary.risks} itemClassName="text-red-800" />
                        </SummarySection>
                    </div>
                );
            case 'authorities':
                 return (
                    <SummarySection title="Authorities Granted" icon={<Gavel className="w-7 h-7 text-yellow-600" />}>
                        <BulletList items={editableSummary.authoritiesGranted} itemClassName="text-yellow-800" />
                    </SummarySection>
                );
            case 'clauses':
                return (
                     editableSummary.extractedClauses && editableSummary.extractedClauses.length > 0 && (
                        <SummarySection title="Key Clauses Extracted" icon={<ClipboardList className="w-7 h-7 text-indigo-600" />}>
                             <p className="text-sm text-gray-500 mb-4">Review the AI-extracted clauses. You can click the pencil icon to edit any clause before saving to your workspace.</p>
                            <div className="border-t">
                                {editableSummary.extractedClauses.map((clause, index) => (
                                   <ClauseAccordionItem
                                        key={index}
                                        clause={clause}
                                        isOpen={openClauseIndex === index}
                                        onClick={() => handleClauseToggle(index)}
                                        onEdit={() => handleEditClause(index)}
                                        isEditing={editingClauseIndex === index}
                                        onSaveEdit={handleSaveClauseEdit}
                                        onCancelEdit={handleCancelClauseEdit}
                                   />
                                ))}
                            </div>
                        </SummarySection>
                    )
                );
            default:
                return null;
        }
    };

    const tabs: { key: TabKey; label: string }[] = [
        { key: 'summary', label: 'Summary' },
        { key: 'benefitsRisks', label: 'Benefits & Risks' },
        { key: 'authorities', label: 'Authorities Granted' },
    ];
    if (editableSummary.extractedClauses && editableSummary.extractedClauses.length > 0) {
        tabs.push({ key: 'clauses', label: 'Key Clauses' });
    }

    const getTabClassName = (tabKey: TabKey) => {
        const baseClasses = 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-base transition-colors';
        if (activeTab === tabKey) {
            return `${baseClasses} border-brand-primary text-brand-primary`;
        }
        return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
    };


    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
             <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                    {onSaveToWorkspace && (
                         <button 
                            onClick={() => onSaveToWorkspace(editableSummary, notes)}
                            className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors bg-brand-secondary hover:bg-green-600"
                        >
                            <Save className="w-5 h-5" />
                            {isSaved ? 'Update in Workspace' : 'Save to Workspace'}
                        </button>
                    )}
                     <button onClick={onAttemptSendForSignature} className="flex items-center gap-2 px-4 py-2 text-brand-primary font-semibold border border-brand-primary hover:bg-blue-100 rounded-lg transition-colors">
                        <Send className="w-5 h-5" />
                        Send for Signature
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-brand-primary font-semibold hover:bg-blue-100 rounded-lg transition-colors">
                        <Printer className="w-5 h-5" />
                        Print
                    </button>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                 <h1 className="text-3xl font-extrabold text-brand-primary mb-2">{editableSummary.title}</h1>
                 <p className="text-sm text-gray-500">Original file: {fileName}</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={getTabClassName(tab.key)}
                            aria-current={activeTab === tab.key ? 'page' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6 space-y-6">
                {renderTabContent()}
                {onSaveToWorkspace && (
                    <SummarySection title="My Notes" icon={<ClipboardList className="w-7 h-7 text-purple-600" />}>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="Add your personal notes about this document here..."
                        />
                         <p className="text-xs text-gray-500 mt-2">
                            {isSaved ? "Your notes are saved in your workspace. Click 'Update in Workspace' to save changes." : "Your notes will be saved to your workspace along with the document summary."}
                         </p>
                    </SummarySection>
                )}
            </div>
        </div>
    );
};
