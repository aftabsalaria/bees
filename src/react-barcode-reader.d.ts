// react-barcode-reader.d.ts
declare module 'react-barcode-reader' {
    import * as React from 'react';
  
    interface BarcodeReaderProps {
      onScan?: (data: string | null) => void;
      onError?: (error: any) => void;
      minLength?: number;
      resolution?: number;
      // Add other props as needed based on the library's documentation
    }
  
    const BarcodeReader: React.ComponentClass<BarcodeReaderProps>;
    export default BarcodeReader;
  }
  