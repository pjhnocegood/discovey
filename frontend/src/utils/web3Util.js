
import { ABI } from './ABI'
import { getPrivateKey, getSafeAddress} from './storageUtil';
import { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers';
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import Web3 from 'web3';
import * as signer from "@pushprotocol/restapi/src/lib/helpers";
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const web3 = new Web3(provider);
import {OperationType} from '@safe-global/safe-core-sdk-types'

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
const userSigner = new ethers.Wallet(getPrivateKey(), provider)
const userEthAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: userSigner
})

export const deriveAddress =( addressIndex) => {
  // Coin Type 및 네트워크 ID를 사용하여 BIP-44 경로를 생성
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const derivationPath = `m/44'/0'/0'/0/${addressIndex}`;
  // 개인 키 및 주소를 파생
  const privateKey = getPrivateKey();

  // 문자열을 해시 함수를 사용하여 바이트 배열로 변환
  // esm에서 crypto를 사용하려면 crypto-browserify를 설치해야 함
  const cryptoUtil = require('crypto');
  const entropyBytes = cryptoUtil.createHash('sha256').update(privateKey).digest();
  const mnemonic = bip39.entropyToMnemonic(entropyBytes.toString('hex'));

  console.log(mnemonic)
  // Wallet 객체를 사용하여 파생 키 생성
  const network = 'homestead'; // Ethereum 메인넷
  const path = "m/44'/60'/0'/0/0"; // Ethereum 주요 경로


// HDNode 경로를 사용하여 파생 키 생성
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(path);
  const derivedWallet = new ethers.Wallet(hdNode.privateKey);

  console.log('Derived Private Key:', derivedWallet.privateKey);
  console.log('Derived Address:', derivedWallet.address);
  const derivedWalletAddress = derivedWallet.address;
  const derivedWalletPrivateKey = derivedWallet.privateKey;
  return { derivedWalletAddress, derivedWalletPrivateKey };
}

export const transferToken = async (amount) => {

  const privateKey = getPrivateKey();
  const wallet = new ethers.Wallet(privateKey, provider);

  const tokenAddress = '0x9bc747F90294933588584Eb122B035489D6a7da2'; // ERC-20 토큰의 주소
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



export async function transferTokenToDiscovey(amount){



  const userSafeWallet = await getSafeAddress();
  console.log(userSigner)
  console.log(userEthAdapter)
  console.log(userSafeWallet)
  const safe = await Safe.create({
    ethAdapter : userEthAdapter,
    safeAddress: '0xE95f749A1e5A6123B97A6350B7177120D0A47890',

  })

  const tokenAddress = '0x9bc747F90294933588584Eb122B035489D6a7da2'; // ERC-20 토큰의 주소
  const discoveySafeAddress = '0xF4FA7F09d50C339334170671c82fc969F986A3d1'

  // ERC-20 토큰 전송 데이터 생성
  const tokenContract = new web3.eth.Contract(ABI, tokenAddress);
  const data = tokenContract.methods.transfer(discoveySafeAddress, amount).encodeABI();

  const safeTransactionData = {
    to: tokenAddress,
    value: '0', // 1 wei
    data: data,
    operation: OperationType.Call
  }


  const safeTransaction = await safe.createTransaction({ safeTransactionData })
  const senderAddress = await userSigner.getAddress()
  const safeTxHash = await safe.getTransactionHash(safeTransaction)
  const signature = await safe.signTransactionHash(safeTxHash)

  console.log('senderAddress :',senderAddress)
  console.log('safeTransaction : ', safeTransaction)
    console.log('safeTxHash :', safeTxHash)
    console.log('signature :',signature)
  // Propose transaction to the service
  const safeApiKit = new SafeApiKit({
    txServiceUrl: txServiceUrl,
    ethAdapter : userEthAdapter,
  })

  console.log('safe.getAddress() :', await safe.getAddress())
  await safeApiKit.proposeTransaction({
    safeAddress: '0xE95f749A1e5A6123B97A6350B7177120D0A47890',
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signature.data
  })

  return true;
}
