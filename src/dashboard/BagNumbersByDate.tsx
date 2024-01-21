import React, { useState } from 'react';
import { Typography, Container, Paper, TextField, Button, ButtonGroup } from '@mui/material';
import EntriesByBag from './EntriesByBag'; // Import the new component
import { app } from '../firebase';
import { getFirestore, collection, query, getDocs, orderBy, where } from "@firebase/firestore";

const firestore = getFirestore(app);

const BagNumbersByDate: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [bagNumbers, setBagNumbers] = useState<string[]>([]);
  const [selectedBag, setSelectedBag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchBagNumbers = async () => {
    try {
      console.log('Fetching bag numbers...');
      const csvDataCollection = collection(firestore, 'csvData');

      // Format dates to "YYYY-MM-DD" for Firestore query
      const startISO = new Date(startDate).toISOString().split('T')[0];
      const endISO = new Date(endDate).toISOString().split('T')[0];

      // Add timestamp conditions and use 'date' for sorting
      const q = query(
        csvDataCollection,
        where('date', '>=', startISO),
        where('date', '<=', endISO),
        orderBy('date')  // Update to use the 'date' field for sorting
      );

      console.log('Query:', q);

      const querySnapshot = await getDocs(q);

      console.log('Query Snapshot:', querySnapshot.docs.map(doc => doc.data()));

      if (querySnapshot.docs.length === 0) {
        setError('No bags found within the specified date range.');
        setBagNumbers([]);
        setSelectedBag(null);
        return;
      }

      const bagNosSet = new Set<string>();

      querySnapshot.docs.forEach((doc) => {
        const bagNo = doc.data().bag;
        console.log(`Fetched bag number: ${bagNo}`);
        bagNosSet.add(bagNo);
      });

      const bagNos = Array.from(bagNosSet); // Convert Set to array

      console.log('Fetched unique bag numbers:', bagNos);

      setBagNumbers(bagNos);
      setError(null);

      // Reset selectedBag, selectedAwb, and entryDetails
      setSelectedBag(null);
    } catch (error) {
      console.error('Error fetching bag numbers:', error);
      setError('Error fetching bag numbers. Please try again.');
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Fetch Bag Numbers by Date
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ style: { height: 40 } }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginLeft: '10px' }}
            InputProps={{ style: { height: 40 } }}
          />
          <Button variant="contained" onClick={handleFetchBagNumbers} style={{ marginLeft: '10px', height: 40 }}>
            Fetch Bag Numbers
          </Button>
        </div>
        {error && <Typography color="error">Error: {error}</Typography>}
        {bagNumbers.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Bag Numbers within the Date Range:
            </Typography>
            <ButtonGroup color="primary" variant="text">
              {bagNumbers.map((bagNo, index) => (
                <Button key={index} onClick={() => setSelectedBag(bagNo)}>
                  {bagNo}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        )}
        {selectedBag && <EntriesByBag selectedBag={selectedBag} />}
      </Paper>
    </Container>
  );
};

export default BagNumbersByDate;
