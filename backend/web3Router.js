const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');
require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'discovey.site',
  user: 'discovey',
  password: 'Survey!23',
  database: 'discovey'
};
const web3 = new Web3(process.env.ETH_RPC_URL);


router.get('/balance/:address', async (req, res) => {
  const address = req.params.address;

  console.log('address :',address)
  try {
    const contractAddress = '0x9bc747F90294933588584Eb122B035489D6a7da2'; // ERC-20 토큰의 스마트 계약 주소
    const abi = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ];

// 계정 주소와 ERC-20 토큰 주소를 지정
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM account where ethereum_address = ? limit 1', [address]);
    connection.end();
    if(rows[0].safe_wallet === null){
        res.json({ count:"0" });
        return;
    }
    const accountAddress = rows[0].safe_wallet; // ERC-20 토큰의 balanceOf 함수를 호출할 주소
    const erc20Contract = new web3.eth.Contract(abi, contractAddress);
    console.log("accountAddress : ",accountAddress)
// balanceOf 함수를 호출하여 잔고를 가져옵니다.
    const count= await erc20Contract.methods.balanceOf(accountAddress).call()
  console.log(count.toString())
    res.json({ count:count.toString() });
  } catch (err) {
    console.error(err);
    res.json({ count:"0" });
  }
});

module.exports = router;