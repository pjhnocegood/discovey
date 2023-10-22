import { EthersAdapter } from '@safe-global/protocol-kit'
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
const signer = new ethers.Wallet(process.env.SAFE_WALLET_PRIVATE_KEY, provider)
const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
})
const safeAddress = '0xa2Da09eb0E491B17a9Fa548a03F6A82E8fd75769'
const tokenAddress = '0xd4062d97c79af61114481111d2d0924b71f59e48'; // ERC-20 토큰의 주소
const safeApiKit = new SafeApiKit({
    txServiceUrl: 'https://safe-transaction-zkevm.safe.global',
    ethAdapter
})
const tokenAbi = ABI; // ERC-20 토큰 컨트랙트 ABI


export async function createTransaction(dataArray){
    const safe = await Safe.create({
        ethAdapter,
        safeAddress: safeAddress
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


    const senderAddress = await signer.getAddress()
    const safeTxHash = await safe.getTransactionHash(safeTransactions)
    const signature = await safe.signTransactionHash(safeTxHash)

    // Propose transaction to the service
    await safeApiKit.proposeTransaction({
        safeAddress: await safe.getAddress(),
        safeTransactionData: safeTransactions.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data
    })
}

export async function confirm(){

    const pendingTransactions = await safeApiKit.getPendingTransactions(safeAddress)
    console.log(pendingTransactions.results)
    const transaction = pendingTransactions.results[0]
    const safeTxHash = transaction.safeTxHash


    const safeSdkOwner2 = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress
    })

    const signature = await safeSdkOwner2.signTransactionHash(safeTxHash)
    const response = await safeApiKit.confirmTransaction(safeTxHash, signature.data)
    console.log('===================================================================')
    console.log(response)
    console.log('===================================================================')
    const safeTransaction = await safeApiKit.getTransaction(safeTxHash)
    console.log('safeTransaction :',safeTransaction)



    const executeTxResponse = await safeSdkOwner2.executeTransaction(safeTransaction)
    console.log('executeTxResponse :',executeTxResponse)
    const receipt =  executeTxResponse.transactionResponse.wait();

    console.log('Transaction executed:')
    console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
}

//createTransaction('0xa203F792EA9795B7Cd03832aD742AE0501F2F97c',2);
//confirm();
