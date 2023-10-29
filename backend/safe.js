import { EthersAdapter ,SafeFactory} from '@safe-global/protocol-kit'
import {OperationType} from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers';
import { ABI } from './ABI'
import Web3 from 'web3';

import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
require('dotenv').config();

//const  provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/t6jMawenw71AeHaz6Pzq9_pYJhvklERD')
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const web3 = new Web3(provider);
const discoveySigner = new ethers.Wallet(process.env.DISCOVEY_SAFE_WALLET_PRIVATE_KEY, provider)
const discoveyEthAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: discoveySigner
})
const deploySigner = new ethers.Wallet(process.env.DEPLOY_SAFE_WALLET_PRIVATE_KEY, provider)
const deployEthAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deploySigner
})
const confirmSigner = new ethers.Wallet(process.env.CONFIRM_SAFE_WALLET_PRIVATE_KEY, provider)
const confirmEthAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: confirmSigner
})

const discoveySafeAddress = '0x61Af13E6566Cc79626Ea5Ed5b904B75AbD73697F'
const tokenAddress = '0x9bc747F90294933588584Eb122B035489D6a7da2'; // ERC-20 토큰의 주소
const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

const tokenAbi = ABI; // ERC-20 토큰 컨트랙트 ABI


export async function createTransaction(dataArray){
    const safe = await Safe.create({
        ethAdapter: discoveyEthAdapter,
        safeAddress: discoveySafeAddress
    })

    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    const safeTransactionData = [];
    for (let i = 0; i < dataArray.length; i++) {
        const data = tokenContract.methods.transfer(dataArray[0].ethereum_address, dataArray[0].amount).encodeABI();
        safeTransactionData.push({
            to: tokenAddress,
            value: '0', // 1 wei
            data: data,
            operation: OperationType.Call
        })
    }
    console.log(safeTransactionData)

    const options = {
        safeTxGas: 2300,
    }
    const callsOnly = true
    const safeTransactions = await safe.createTransaction({safeTransactionData,options,callsOnly})


    const senderAddress = await discoveySigner.getAddress()
    const safeTxHash = await safe.getTransactionHash(safeTransactions)
    const signature = await safe.signTransactionHash(safeTxHash)

    // Propose transaction to the service
    const safeApiKit = new SafeApiKit({
        txServiceUrl: txServiceUrl,
        ethAdapter :deployEthAdapter
    })
    await safeApiKit.proposeTransaction({
        safeAddress: await safe.getAddress(),
        safeTransactionData: safeTransactions.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data
    })
    const pendingTransactions =
        await safeApiKit.getPendingTransactions(discoveySafeAddress)
    console.log(pendingTransactions.results)
    const transaction = pendingTransactions.results[0]


    const response = await safeApiKit.confirmTransaction(safeTxHash, signature.data)
    console.log(response)
}

export async function confirm(safeAddress){

    let ethAdapter;

    if (safeAddress ==='discovey'){
        ethAdapter = discoveyEthAdapter
        safeAddress = discoveySafeAddress
    }else{
        ethAdapter = confirmEthAdapter
    }

    console.log('safeAddress :',safeAddress)
    const safeSdkOwner2 = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress
    })

    const safeApiKit = new SafeApiKit({
        txServiceUrl: txServiceUrl,
        ethAdapter:ethAdapter
    })
    const pendingTransactions = await safeApiKit.getPendingTransactions(safeAddress)
    console.log(pendingTransactions.results)
    const transaction = pendingTransactions.results[0]
    const safeTxHash = transaction.safeTxHash

    const safeTransaction = await safeApiKit.getTransaction(safeTxHash)
    console.log('safeTransaction :',safeTransaction)


    const executeTxResponse = await safeSdkOwner2.executeTransaction(safeTransaction)
    console.log('executeTxResponse :',executeTxResponse)
    const receipt =  executeTxResponse.transactionResponse.wait();

    console.log('Transaction executed:')
    console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
}

 export async function createSafeWallet(walletAddress){

     const safeFactory = await SafeFactory.create({ ethAdapter: deployEthAdapter })

     const safeAccountConfig  = {
         owners: [
             walletAddress
         ],
         threshold: 1,
         // ... (Optional params)
     }

     /* This Safe is tied to owner 1 because the factory was initialized with
     an adapter that had owner 1 as the signer. */
     const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

     const safeAddress = await safeSdkOwner1.getAddress()

     console.log('Your Safe has been deployed:')
     console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
     console.log(`https://app.safe.global/gor:${safeAddress}`)
    return safeAddress
 }

//createTransaction('0xa203F792EA9795B7Cd03832aD742AE0501F2F97c',2);
//confirm();
//createSafeWallet()

