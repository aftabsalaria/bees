// BarcodeScanner.tsx
import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';

const BarcodeScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedData(data);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div>
      <h2>Barcode Scanner</h2>
      {scannedData && (
        <div>
          <p>Scanned Barcode:</p>
          <p>{scannedData}</p>
        </div>
      )}
      <BarcodeReader
        onScan={handleScan}
        onError={handleError}
      />
    </div>
  );
};

export default BarcodeScanner;
