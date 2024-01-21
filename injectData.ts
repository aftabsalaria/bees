// injectData.ts

import * as admin from 'firebase-admin';
import { app } from './firebase'; // Adjust the path as needed.

// Replace 'path-to-your-service-account-key.json' with the actual path to your service account key file.
const serviceAccount = require('firebase.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: app.options.databaseURL,
});

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
