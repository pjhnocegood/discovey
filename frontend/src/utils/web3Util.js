
import { ABI } from './ABI'
import { getEthereumAddress, getPrivateKey } from './storageUtil';
import { ethers } from 'ethers';



export const transferToken = async (amount) => {
  const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const privateKey = getPrivateKey();
  const wallet = new ethers.Wallet(privateKey, provider);

  const tokenAddress = '0xd4062d97c79af61114481111d2d0924b71f59e48'; // ERC-20 토큰의 주소
  const safeAddress = '0xa2Da09eb0E491B17a9Fa548a03F6A82E8fd75769'
  // ERC-20 토큰 전송 데이터 생성
  // ERC-20 토큰 스마트 계약 주소 및 ABI 설정
  const tokenAbi =ABI

  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
  const data = tokenContract.interface.encodeFunctionData("transfer", [safeAddress, amount] )

  const tx = await wallet.sendTransaction({
    to: tokenContract,
    from: wallet.address,
    value: ethers.parseUnits("0.000", "ether"),
    gasLimit: 510000,
    gasPrice: ethers.parseUnits("1", "gwei"),
    data: data
  });

  console.log("Mining transaction...");

  // Waiting for the transaction to be mined
  const receipt = await tx.wait();

  console.log("Mined in block " + receipt.blockNumber);
  //console.log(`https://${network}.etherscan.io/tx/${tx.hash}`);
  console.log(receipt.blockHash);
}
