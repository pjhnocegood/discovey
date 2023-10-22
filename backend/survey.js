const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'discovey',
  password: 'Survey!23',
  database: 'discovey'
};

router.get('/surveys', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM survey');
    connection.end();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

router.get('/surveys/:id/:avatar', async (req, res) => {
    try {
      const surveyId = req.params.id; // URL에서 파라미터로 전달된 id 값을 가져옵니다.
      const avatar = req.params.avatar; // URL에서 파라미터로 전달된 id 값을 가져옵니다.
      const connection = await mysql.createConnection(dbConfig);
      console.log("avatar :",avatar)
      const [rows] = await connection.execute('SELECT ' +
          'sd.survey_detail_id,sd.survey_id,sd.question,sd.question,sa.answer FROM survey_detail sd ' +
          'join survey s on s.survey_id = sd.survey_id ' +
          'left join survey_answer sa on sd.survey_detail_id = sa.survey_detail_id and sa.avatar = ? WHERE sd.survey_id = ?', [avatar,surveyId]);
      connection.end();

      console.log(rows)
      if (rows.length === 0) {
        res.status(404).json({ error: '설문조사를 찾을 수 없습니다.' });
      } else {
        res.json(rows); // 설문조사를 JSON 형식으로 반환합니다.
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '데이터를 불러오는 데 실패했습니다.' });
    }
  });

router.post('/surveys/:id/answer', async (req, res) => {
  const {serveyAnswer,avatar,ethereumAddress  } = req.body;
  console.log(req.body)
  const surveyId = req.params.id; // URL에서 파라미터로 전달된 id 값을 가져옵니다.
  try {
    const connection = await mysql.createConnection(dbConfig);

    serveyAnswer.forEach(async (answer) => {
        await connection.execute('INSERT INTO survey_answer (survey_id,survey_detail_id, answer, avatar)' +
            ' VALUES (?, ?, ?, ?)', [surveyId, answer.surveyDetailId, answer.answer, avatar]);
    });
    const [rows] =   await connection.execute('SELECT compensation FROM survey where survey_id =? limit 1',[surveyId]);
    console.log("rows :"+rows[0].compensation)
    await connection.execute('INSERT INTO token_transfer (ethereum_address, amount) VALUES (?, ?)', [ethereumAddress, +rows[0].compensation]);



    connection.end();
    res.status(201).json({ message: 'Added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add' });
  }
});

router.post('/surveys', async (req, res) => {
  const {title, compensation, max ,avatar,questions } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [results, fields] =await connection.execute('INSERT INTO survey (title, compensation, max, avatar) VALUES (?, ?, ?, ?)', [title, compensation, max, avatar]);
    const surveyId = results.insertId;
    questions.forEach(async (question) => {
        await connection.execute('INSERT INTO survey_detail (survey_id, question) VALUES (?, ?)', [surveyId, question]);
    });




    connection.end();
    res.status(201).json({ message: 'Added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add' });
  }
});

module.exports = router;