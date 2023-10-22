const express = require('express');
const router = express.Router();
const { Web3 } = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.ETH_RPC_URL);


router.get('/balance/:address', async (req, res) => {
  const address = req.params.address;

  console.log('address :',address)
  try {
    const contractAddress = '0xd4062d97c79af61114481111d2d0924b71f59e48'; // ERC-20 토큰의 스마트 계약 주소
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
    const accountAddress = address; // ERC-20 토큰의 balanceOf 함수를 호출할 주소
    const erc20Contract = new web3.eth.Contract(abi, contractAddress);

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