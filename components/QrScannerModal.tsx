import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from './icons';

interface QrScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = 'qr-code-reader';

  useEffect(() => {
    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const cameraId = cameras[0].id;
          scannerRef.current = new Html5Qrcode(readerId);
          scannerRef.current.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText, _) => {
              onScanSuccess(decodedText);
              if (scannerRef.current?.isScanning) {
                scannerRef.current.stop();
              }
            },
            (errorMessage) => {
              // console.warn(`QR Code no match: ${errorMessage}`);
            }
          ).catch((err) => {
              console.error("Failed to start scanner:", err);
              alert("Failed to start camera. Please check permissions.");
              onClose();
          });
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
        alert("Could not access camera. Please ensure you have a camera and have granted permission.");
        onClose();
      }
    };
    
    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
            console.error("Failed to stop scanner cleanly", err);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Scan Document QR Code</h2>
        <div id={readerId} className="w-full h-auto rounded-md overflow-hidden border"></div>
        <p className="text-center text-sm text-gray-500 mt-4">Align the QR code within the frame.</p>
      </div>
    </div>
  );
};
