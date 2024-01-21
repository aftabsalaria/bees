// import React, { useEffect, useState } from 'react';
// import { app } from './firebase'; // Import your firebase configuration
// import { getFirestore, collection, getDocs } from "@firebase/firestore";

// const firestore = getFirestore(app);

// const CSVDataViewer: React.FC = () => {
//   const [csvData, setCsvData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const csvDataCollection = collection(firestore, 'csvData');
//         const querySnapshot = await getDocs(csvDataCollection);

//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setCsvData(data);
//       } catch (error) {
//         console.error('Error fetching CSV data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const totalItems = csvData.length;

//   return (
//     <div>
//       <h2>CSV Data Viewer</h2>
//       {totalItems === 0 ? (
//         <p>No data available</p>
//       ) : (
//         <div>
//           <table>
//             <thead>
//               <tr>
//                 <th>AWB No.</th>
//                 <th>Customer Name</th>
//                 <th>Customer Address</th>
//                 <th>Pincode</th>
//                 <th>Goods Description</th>
//                 <th>Order Value</th>
//                 <th>Bag</th>
//                 {/* Add more columns as needed */}
//               </tr>
//             </thead>
//             <tbody>
//               {csvData.map((rowData) => (
//                 <tr key={rowData.id}>
//                   <td>{rowData.awbNo}</td>
//                   <td>{rowData.customerName}</td>
//                   <td>{rowData.customerAddress}</td>
//                   <td>{rowData.pincode}</td>
//                   <td>{rowData.goodsDescription}</td>
//                   <td>{rowData.orderValue}</td>
//                   <td>{rowData.bag}</td>
//                   {/* Add more columns as needed */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <p>Total Items: {totalItems}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CSVDataViewer;
import React, { useEffect, useState } from 'react';
import { app } from './firebase'; // Import your firebase configuration
import { getFirestore, collection, getDocs, query, orderBy } from "@firebase/firestore";

const firestore = getFirestore(app);

const CSVDataViewer: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvDataCollection = collection(firestore, 'csvData');
        const q = query(csvDataCollection, orderBy('bag', sortOrder));
        const querySnapshot = await getDocs(q);

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
  }, [sortOrder]);

  const totalItems = csvData.length;

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <h2>
        CSV Data Viewer{' '}
        <button onClick={toggleSortOrder}>
          Sort by Bag No ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </h2>
      {totalItems === 0 ? (
        <p>No data available</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>AWB No.</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Pincode</th>
                <th>Goods Description</th>
                <th>Order Value</th>
                <th onClick={toggleSortOrder}>Bag No</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {csvData.map((rowData) => (
                <tr key={rowData.id}>
                  <td>{rowData.awbNo}</td>
                  <td>{rowData.customerName}</td>
                  <td>{rowData.customerAddress}</td>
                  <td>{rowData.pincode}</td>
                  <td>{rowData.goodsDescription}</td>
                  <td>{rowData.orderValue}</td>
                  <td>{rowData.bag}</td>
                  {/* Add more columns as needed */}
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total Items: {totalItems}</p>
        </div>
      )}
    </div>
  );
};

export default CSVDataViewer;
