import React, { useState, useEffect } from 'react';
import { Typography, Paper, ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider } from '@mui/material';
import { app } from '../firebase';
import { getFirestore, collection, query, getDocs, where } from "@firebase/firestore";

const firestore = getFirestore(app);

interface Entry {
  awbNo: string;
  bag: string;
  customerAddress: string;
  customerName: string;
  date: string;
  goodsDescription: string;
  orderValue: string;
  pincode: string;
}

interface EntriesByBagProps {
  selectedBag: string;
}

const EntriesByBag: React.FC<EntriesByBagProps> = ({ selectedBag }) => {
  const [awbNumbers, setAwbNumbers] = useState<string[]>([]);
  const [selectedAwb, setSelectedAwb] = useState<string | null>(null);
  const [entryDetails, setEntryDetails] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEntriesByBag = async () => {
      try {
        console.log(`Fetching entries for bag: ${selectedBag}`);
        const csvDataCollection = collection(firestore, 'csvData');

        const q = query(
          csvDataCollection,
          where('bag', '==', selectedBag)
        );

        const querySnapshot = await getDocs(q);

        console.log('Query Snapshot:', querySnapshot.docs.map(doc => doc.data()));

        const awbNos: string[] = querySnapshot.docs.map((doc) => {
          const entry = doc.data() as Entry;
          return entry.awbNo;
        });

        console.log('Fetched AWB numbers:', awbNos);

        setAwbNumbers(awbNos);
        setError(null);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setError('Error fetching entries. Please try again.');
      }
    };

    fetchEntriesByBag();
  }, [selectedBag]);

  const handleAwbButtonClick = async (awbNo: string) => {
    try {
      console.log(`Fetching details for AWB: ${awbNo}`);
      const csvDataCollection = collection(firestore, 'csvData');

      const q = query(
        csvDataCollection,
        where('awbNo', '==', awbNo)
      );

      const querySnapshot = await getDocs(q);

      console.log('Query Snapshot:', querySnapshot.docs.map(doc => doc.data()));

      if (querySnapshot.docs.length > 0) {
        const entryDetails = querySnapshot.docs.map((doc) => doc.data() as Entry);
        console.log('Fetched entry details:', entryDetails);
        setEntryDetails(entryDetails);
        setSelectedAwb(awbNo);
        setDialogOpen(true);
      } else {
        console.error('No details found for AWB:', awbNo);
        setError('No details found for the selected AWB. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching entry details:', error);
      setError('Error fetching entry details. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Paper elevation={0} style={{ padding: '0px', marginTop: '0px', boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom>
          Shipments present in Bag: {selectedBag}
        </Typography>
        {error && <Typography color="error">Error: {error}</Typography>}
        {awbNumbers.length > 0 && (
          <div style={{ marginTop: '5px', marginBottom: '5px' }}>
            <ButtonGroup color="primary" variant="text" style={{ flexWrap: 'wrap' }} size="small">
              {awbNumbers.map((awbNo, index) => (
                <Button key={index} style={{ margin: '5px' }} onClick={() => handleAwbButtonClick(awbNo)}>
                  {awbNo}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        )}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{`Details for Shipment ID: ${selectedAwb}`}</DialogTitle>
        <DialogContent dividers>
          {entryDetails.length > 0 && (
            <List>
              {entryDetails.map((entry, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Customer Name: ${entry.customerName}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">{`Customer Address: ${entry.customerAddress}`}</Typography>
                          <Typography variant="body2" color="textSecondary">{`Description: ${entry.goodsDescription}`}</Typography>
                          <Typography variant="body2" color="textSecondary">{`Order Value: ${entry.orderValue}`}</Typography>
                          <Typography variant="body2" color="textSecondary">{`Shipment Arrived: ${entry.date}`}</Typography>
                          <Typography variant="body2" color="textSecondary">{`Pincode: ${entry.pincode}`}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < entryDetails.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntriesByBag;
