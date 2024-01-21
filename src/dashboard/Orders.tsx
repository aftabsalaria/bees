import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { app } from '../firebase'; // Import your firebase configuration
import { getFirestore, collection, getDocs } from "@firebase/firestore";

const firestore = getFirestore(app);

export default function Orders() {
  const [csvData, setCsvData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const csvDataCollection = collection(firestore, 'csvData');
        const querySnapshot = await getDocs(csvDataCollection);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCsvData(data);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>AWB No.</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Customer Address</TableCell>
            <TableCell>Pincode</TableCell>
            <TableCell>Goods Description</TableCell>
            <TableCell>Order Value</TableCell>
            <TableCell>Bag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {csvData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.awbNo}</TableCell>
              <TableCell>{row.customerName}</TableCell>
              <TableCell>{row.customerAddress}</TableCell>
              <TableCell>{row.pincode}</TableCell>
              <TableCell>{row.goodsDescription}</TableCell>
              <TableCell>{row.orderValue}</TableCell>
              <TableCell>{row.bag}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={(event) => event.preventDefault()} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
