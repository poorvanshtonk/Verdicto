import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      {message && <p className="mt-4 text-lg font-semibold text-brand-dark">{message}</p>}
    </div>
  );
};
