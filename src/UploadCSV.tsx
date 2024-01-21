import React from 'react';
import { app } from './firebase'; // Import your firebase configuration
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import CSVReader from 'react-csv-reader';

const firestore = getFirestore(app);

interface CsvDataRow {
  awbNo: string;
  customerName: string;
  customerAddress: string;
  pincode: string;
  goodsDescription: string;
  orderValue: string;
  bag: string;
  timestamp: string; // Change the type to string
  date: string;
}

const UploadCSV: React.FC = () => {
  const handleUpload = async (data: any[][]) => {
    try {
      const csvDataCollection = collection(firestore, 'csvData');
  
      data.forEach(async (row) => {
        const currentDate = new Date();
        const csvDataRow: CsvDataRow = {
          awbNo: row[0] || '',
          customerName: row[1] || '',
          customerAddress: row[2] || '',
          pincode: row[3] || '',
          goodsDescription: row[4] || '',
          orderValue: row[5] || '',
          bag: row[6] || '',
          timestamp: currentDate.toISOString(), // Store the timestamp as an ISO 8601 string
          date: currentDate.toISOString().split('T')[0], // Extract only the date part
        };
  
        // Log the data being uploaded
        console.log('Uploading CSV data:', csvDataRow);
  
        if (csvDataRow.customerName.trim() !== '') {
          await addDoc(csvDataCollection, csvDataRow);
          console.log('Document added successfully:', csvDataRow);
        }
      });
  
      alert('CSV data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading CSV data:', error);
      alert('Error uploading CSV data. Please check the console for details.');
    }
  };
  
  

  return (
    <div>
      <h2>Upload CSV to Firebase</h2>
      <CSVReader onFileLoaded={handleUpload} />
    </div>
  );
};

export default UploadCSV;
