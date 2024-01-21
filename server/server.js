const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root@localhost',
  password: '',
  port: DB_PORT,
  database: 'bees',
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/api/upload-csv', (req, res) => {
  try {
    const { awb_no, customer_name, customer_address, pincode, goods_description, value, bag_info } = req.body;

    const sql = `
      INSERT INTO shipment (awb_no, customer_name, customer_address, pincode, goods_description, value, bag_info)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [awb_no, customer_name, customer_address, pincode, goods_description, value, bag_info], (error, results) => {
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        console.log('Data inserted into MySQL:', results);
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Error handling CSV upload:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
