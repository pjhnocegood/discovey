// myCron.js
import * as mysql from 'mysql2/promise';



const dbConfig = {
    host: 'localhost',
    user: 'discovey',
    password: 'Survey!23',
    database: 'discovey'
};
import cron from 'node-cron';
import {confirm, createTransaction} from "./safe.js";

// Cron 작업 정의
const myCronJob = cron.schedule(' */3 * * * *', async  () => {
    // 여기에 1분에 한 번 실행하고자 하는 작업을 넣습니다.
    console.log('Cron 작업이 1분에 한 번 실행되었습니다.');

    try {

        console.log("connection start")
        const connection = await mysql.createConnection(dbConfig);
        console.log("connection")
        const [rows] = await connection.execute('SELECT * FROM token_transfer where is_completed = 0 limit 10');
        console.log(rows);

        //2건 이상일때만 처리
        if(rows.length > 1){
            await createTransaction(rows)
            await confirm();

            for (let i = 0; i < rows.length; i++) {
                await connection.execute('UPDATE token_transfer SET is_completed = 1 WHERE token_transfer_id = ?', [rows[i].token_transfer_id]);
            }
        }

        connection.end();
    } catch (err) {
        console.error(err);
        console.log(err)
    }

}, {
    timezone: 'Asia/Seoul', // 원하는 타임존으로 설정
});

async function makeTransaction(){

}

// Cron 작업 시작
myCronJob.start();
