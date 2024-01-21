// InjectDataComponent.tsx

import { useEffect } from 'react';
import * as admin from 'firebase-admin';
import { app } from './firebase'; // Adjust the path as needed.

// Replace 'path-to-your-service-account-key.json' with the actual path to your service account key file.
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: app.options.databaseURL,
});

const InjectData: React.FC = () => {
  useEffect(() => {
    // Replace 'testData' with your desired data structure.
    const testData: { shipments: { [key: string]: any }[] } = {
      shipments: [
        {
          awb_no: '123456789',
          customer_name: 'John Doe',
          customer_address: '123 Main St',
          pincode: '12345',
          goods_description: 'Sample Goods',
          value: 100,
          bag_info: 'nxb - c56079788',
          created_at: new Date().toISOString(),
        },
        // Add more data as needed...
      ],
    };

    const database = admin.database();

    // Inject data into Firebase Realtime Database.
    database.ref().set(testData)
      .then(() => {
        console.log('Data injected into Firebase successfully.');
      })
      .catch((error: Error) => {
        console.error('Error injecting data into Firebase:', error);
      });
  }, []); // The empty dependency array ensures that the effect runs only once when the component mounts.

  return (
    <div>
      <p>Injecting data into Firebase...</p>
      {/* You can add more JSX for your component if needed */}
    </div>
  );
};

export default InjectData;
