import React, { useState } from 'react';
import { Gavel, ArrowDownCircle } from './icons';

interface SplashPageProps {
  onContinue: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onContinue }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleInitialClick = () => {
    if (!isClicked) {
      setIsClicked(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-brand-light flex flex-col items-center justify-center cursor-pointer transition-all duration-500"
      onClick={handleInitialClick}
    >
      <div className={`text-center transition-transform duration-500 ease-in-out ${isClicked ? '-translate-y-8' : 'translate-y-0'}`}>
        <Gavel className="w-24 h-24 text-brand-primary mx-auto mb-6 animate-tap" />
        <h1 className="text-6xl md:text-7xl font-extrabold text-brand-primary mb-4">
          Verdicto
        </h1>
      </div>
      
      <div className={`transition-opacity duration-500 ${isClicked ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-lg text-gray-500 mt-8 animate-pulse">
          Click anywhere to begin
        </p>
      </div>

      {isClicked && (
        <div className="absolute bottom-24 animate-fade-in">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent the main div click handler from re-firing
              onContinue();
            }}
            className="text-brand-primary animate-bounce-slow"
            aria-label="Continue to site"
          >
            <ArrowDownCircle className="w-16 h-16" />
          </button>
        </div>
      )}
    </div>
  );
};
