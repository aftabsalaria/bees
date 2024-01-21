import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import BarcodeReader from 'react-barcode-reader';
import { app } from '../firebase'; // Import your firebase configuration
import { getFirestore, collection, query, where, getDocs } from "@firebase/firestore";

const firestore = getFirestore(app);

const BarcodeScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [scannedItemData, setScannedItemData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedData(data);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleManualInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(event.target.value);
  };

  const handleManualSearch = async () => {
    try {
      const csvDataCollection = collection(firestore, 'csvData');
      const q = query(csvDataCollection, where('awbNo', '==', manualInput));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const scannedItem = querySnapshot.docs[0].data();
        setScannedData(manualInput);
        setScannedItemData(scannedItem);
        setError(null);
      } else {
        setScannedData(null);
        setScannedItemData(null);
        setError('Item not found in database.');
      }
    } catch (error) {
      console.error('Error searching for item:', error);
      setError('Error searching for item. Please try again.');
    }
  };

  useEffect(() => {
    const fetchScannedItemData = async () => {
      if (scannedData) {
        try {
          const csvDataCollection = collection(firestore, 'csvData');
          const q = query(csvDataCollection, where('awbNo', '==', scannedData));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const scannedItem = querySnapshot.docs[0].data();
            setScannedItemData(scannedItem);
          } else {
            setScannedItemData(null);
          }
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      }
    };

    fetchScannedItemData();
  }, [scannedData]);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Barcode Scanner
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="AWB No."
            variant="outlined"
            value={manualInput}
            onChange={handleManualInput}
          />
          <Button variant="contained" onClick={handleManualSearch} style={{ marginLeft: '10px' }}>
            Search
          </Button>
        </div>
        <BarcodeReader onScan={handleScan} onError={handleError} />
        {error && <Typography color="error">Error: {error}</Typography>}
        {scannedItemData && (
          <div>
            <Typography variant="h6" gutterBottom>
              Scanned AWB No.:
            </Typography>
            <Typography>{scannedData}</Typography>
            <div>
              <Typography variant="h6" gutterBottom>
                Item Details:
              </Typography>
              <ul>
                <li>BAG No.: {scannedItemData.bag}</li>
                <li>AWB No.: {scannedItemData.awbNo}</li>
                <li>Customer Name: {scannedItemData.customerName}</li>
                <li>Customer Address: {scannedItemData.customerAddress}</li>
                {/* Add more details as needed */}
              </ul>
            </div>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default BarcodeScanner;
