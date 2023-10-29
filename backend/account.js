const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'discovey',
  password: 'Survey!23',
  database: 'discovey'
};

router.get('/:ethereumAddress', async (req, res) => {
  const ethereumAddress = req.params.ethereumAddress;
  try {

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM account where ethereum_address = ? limit 1', [ethereumAddress]);
    connection.end();
    console.log('====================================');
    console.log(rows[0])
    console.log('====================================');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

router.post('/', async (req, res) => {
  const {ethereumAddress } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM account where ethereum_address = ? limit 1', [ethereumAddress]);

    if(rows.length === 0){
      await connection.execute('INSERT INTO account (ethereum_address) VALUES (?)', [ethereumAddress]);
      const amount = 10;
      await connection.execute('INSERT INTO token_transfer (ethereum_address,amount) VALUES (?, ?)', [ethereumAddress, amount]);
      res.status(201).json({ message: 'first Login' });
    }else{

      res.status(200).json({ message: 'Login' });
    }
    connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add' });
  }
});

module.exports = router;