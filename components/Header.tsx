import React, { useState } from 'react';
import { Gavel, LogOut, User, FolderLock, Menu, X, Star } from './icons';
import type { StoredUser } from '../types';

interface HeaderProps {
    user: StoredUser | null;
    onLogout: () => void;
    onNavigateToHome: () => void;
    onNavigateToDashboard: () => void;
    onNavigateToWorkspace: () => void;
    onNavigateToPricing: () => void;
}

const NavButton: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string }> = ({ onClick, children, className }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2 text-lg md:text-base md:font-semibold text-brand-dark md:text-brand-primary hover:bg-blue-100 rounded-lg transition-colors w-full md:w-auto text-left ${className}`}
    >
        {children}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateToHome, onNavigateToDashboard, onNavigateToWorkspace, onNavigateToPricing }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (navAction: () => void) => {
    navAction();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => handleNavClick(onNavigateToHome)} className="flex items-center cursor-pointer">
            <Gavel className="w-8 h-8 text-brand-primary" />
            <h1 className="text-2xl font-bold text-brand-dark ml-3">
            Verdicto
            </h1>
        </button>
        <nav className="hidden md:flex items-center gap-2">
            {user?.plan === 'free' && (
                <button 
                    onClick={onNavigateToPricing}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    <Star className="w-5 h-5" />
                    <span>Upgrade</span>
                </button>
            )}
            <NavButton onClick={onNavigateToWorkspace}>
                <FolderLock className="w-5 h-5" />
                <span>My Workspace</span>
            </NavButton>
             <NavButton onClick={onNavigateToDashboard}>
                <User className="w-5 h-5" />
                <span>Dashboard</span>
            </NavButton>
            <NavButton onClick={onLogout}>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
            </NavButton>
        </nav>
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open navigation menu">
                <Menu className="w-7 h-7 text-brand-dark" />
            </button>
        </div>
      </div>
      {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white z-50 animate-fade-in p-4">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <Gavel className="w-8 h-8 text-brand-primary" />
                    <h1 className="text-2xl font-bold text-brand-dark ml-3">Verdicto</h1>
                </div>
                <button onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu">
                    <X className="w-7 h-7 text-brand-dark" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {user?.plan === 'free' && (
                    <button 
                        onClick={() => handleNavClick(onNavigateToPricing)}
                        className="flex items-center gap-3 px-4 py-2 text-lg bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors w-full text-left"
                    >
                        <Star className="w-6 h-6" />
                        <span>Upgrade to Pro</span>
                    </button>
                )}
                <NavButton onClick={() => handleNavClick(onNavigateToWorkspace)}>
                    <FolderLock className="w-6 h-6" />
                    <span>My Workspace</span>
                </NavButton>
                <NavButton onClick={() => handleNavClick(onNavigateToDashboard)}>
                    <User className="w-6 h-6" />
                    <span>Dashboard</span>
                </NavButton>
                <NavButton onClick={() => handleNavClick(onLogout)}>
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                </NavButton>
              </nav>
          </div>
      )}
    </header>
  );
};
