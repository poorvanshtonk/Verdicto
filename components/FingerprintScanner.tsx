import React, { useState, useEffect } from 'react';
import { Fingerprint } from './icons';

interface FingerprintScannerProps {
  onScanComplete: (success: boolean) => void;
  statusText?: string;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'fail';

export const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ onScanComplete, statusText = "Place your finger to scan" }) => {
  const [status, setStatus] = useState<ScanStatus>('idle');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'scanning') {
      timer = setTimeout(() => {
        setStatus('success');
      }, 2000); 
    } else if (status === 'success') {
      timer = setTimeout(() => {
        onScanComplete(true);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [status, onScanComplete]);

  const handleScanStart = () => {
    if (status === 'idle') {
      setStatus('scanning');
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'scanning':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'fail':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStatusText = () => {
      switch(status) {
          case 'scanning': return 'Scanning...';
          case 'success': return 'Scan Complete!';
          case 'fail': return 'Scan Failed. Try Again.';
          case 'idle':
          default:
              return statusText;
      }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div
        className={`relative w-24 h-24 flex items-center justify-center cursor-pointer ${getStatusClasses()}`}
        onClick={handleScanStart}
        role="button"
        aria-label="Start fingerprint scan"
      >
        <Fingerprint className="w-full h-full" />
        {status === 'scanning' && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-1 bg-blue-500/50 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        )}
      </div>
      <p className={`mt-4 text-sm font-semibold ${getStatusClasses()}`}>{getStatusText()}</p>
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-10%); }
            100% { transform: translateY(100%); }
        }
        .animate-\\[scan_2s_ease-in-out_infinite\\] {
            animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
