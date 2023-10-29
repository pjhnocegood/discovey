// myCron.js
import * as mysql from 'mysql2/promise';



const dbConfig = {
    host: 'localhost',
    user: 'discovey',
    password: 'Survey!23',
    database: 'discovey'
};
import cron from 'node-cron';
import {confirm, createSafeWallet, createTransaction} from "./safe.js";

// Cron 작업 정의
let transferTokenRunning = false;
const transferToken = cron.schedule('*/10 * * * * *', async  () => {

    // 여기에 1분에 한 번 실행하고자 하는 작업을 넣습니다.
    if(transferTokenRunning)
        return;
    transferTokenRunning = true;
    console.log('transferToken 작업이  실행되었습니다.');
    try {
        console.log("connection start")
        const connection = await mysql.createConnection(dbConfig);
        console.log("connection")
        const [rows] = await connection.execute('SELECT * FROM token_transfer where is_completed = 0 limit 10');
        console.log(rows);
        //2건 이상일때만 처리
        if(rows.length > 1){
            for (let i = 0; i < rows.length; i++) {
                await connection.execute('UPDATE token_transfer SET is_completed = 1 WHERE token_transfer_id = ?', [rows[i].token_transfer_id]);
            }
            await createTransaction(rows)
            await confirm('discovey');
        }
        connection.end();
        transferTokenRunning = false;
    } catch (err) {
        console.error(err);
        console.log(err)
        transferTokenRunning = false;
    }
}, {
    timezone: 'Asia/Seoul', // 원하는 타임존으로 설정
});
let createSafeAddressRunning = false;
const createSafeAddress = cron.schedule('*/10 * * * * *', async  () => {
    // 여기에 1분에 한 번 실행하고자 하는 작업을 넣습니다.
    if(createSafeAddressRunning)
        return;
    createSafeAddressRunning = true;
    console.log('createSafeAddress 작업이 실행되었습니다.');
    try {
        console.log("connection start")
        const connection = await mysql.createConnection(dbConfig);
        console.log("connection")
        const [rows] = await connection.execute('SELECT * FROM account where is_completed = 0 limit 10');
        console.log(rows);
        //2건 이상일때만 처리
            for (let i = 0; i < rows.length; i++) {
                await connection.execute('UPDATE account SET is_completed = 1 WHERE account_id = ?', [rows[i].account_id]);
                const safeWallet = await createSafeWallet(rows[i].ethereum_address)
                await connection.execute('UPDATE account SET safe_wallet = ? WHERE account_id = ?', [safeWallet,rows[i].account_id]);
            }
        connection.end();
        createSafeAddressRunning = false;
    } catch (err) {
        console.error(err);
        console.log(err)
        createSafeAddressRunning = false;
    }
}, {
    timezone: 'Asia/Seoul', // 원하는 타임존으로 설정
});

let confirmTransactionRunning = false;
const confirmTransaction = cron.schedule('*/10 * * * * *', async  () => {
    // 여기에 1분에 한 번 실행하고자 하는 작업을 넣습니다.
    console.log('confirmTransaction 작업이 실행되었습니다.');
    if(confirmTransactionRunning)
        return;
    confirmTransactionRunning = true;
    try {
        //console.log("connection start")
        const connection = await mysql.createConnection(dbConfig);
        console.log("connection")
        const [rows] = await connection.execute('SELECT * FROM transaction_safe_request where is_completed = 0 limit 10');

        for (let i = 0; i < rows.length; i++) {
            await connection.execute('UPDATE transaction_safe_request SET is_completed = 1 WHERE transaction_safe_request_id = ?', [rows[i].transaction_safe_request_id]);
            await confirm(rows[i].safe_address);
        }

        connection.end();
        confirmTransactionRunning = false;
    } catch (err) {
        console.error(err);
        console.log(err)
        confirmTransactionRunning = false;
    }

}, {
    timezone: 'Asia/Seoul', // 원하는 타임존으로 설정
});


// Cron 작업 시작
transferToken.start();
createSafeAddress.start();
confirmTransaction.start();