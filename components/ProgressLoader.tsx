import React from 'react';
import { CheckCircle } from './icons';

interface ProgressLoaderProps {
  step: number;
}

const steps = [
  "Uploading File",
  "Extracting Text",
  "Analyzing Document"
];

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ step }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
      <h2 className="text-2xl font-bold text-brand-primary mb-8">Processing Your Document...</h2>
      <div className="space-y-6">
        {steps.map((title, index) => {
          const currentStep = index + 1;
          const isCompleted = step > currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={title} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-brand-secondary text-white' : ''}
                ${isCurrent ? 'bg-brand-primary text-white' : ''}
                ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                ) : (
                  <span className="font-bold">{currentStep}</span>
                )}
              </div>
              <div>
                <h3 className={`text-lg font-semibold text-left ${isCompleted || isCurrent ? 'text-brand-dark' : 'text-gray-500'}`}>{title}</h3>
                {isCurrent && <p className="text-sm text-gray-500 text-left">This may take a moment...</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
