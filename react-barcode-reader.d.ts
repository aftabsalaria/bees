// react-barcode-reader.d.ts
declare module 'react-barcode-reader' {
    const BarcodeReader: React.ComponentClass<BarcodeReaderProps>;
    export default BarcodeReader;
  
    interface BarcodeReaderProps {
      onScan?: (data: string | null) => void;
      onError?: (error: any) => void;
      minLength?: number;
      resolution?: number;
      // Add other props as needed based on the library's documentation
    }
  }
  