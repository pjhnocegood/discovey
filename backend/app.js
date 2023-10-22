const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
const contextPath = '/api';

const surveyRouter = require('./survey'); // Import the survey.js module
const oauthRouter = require('./oauth'); // Import the oauth.js module
const web3Router = require('./web3Router'); // Import the survey.js module
const account = require('./account'); // Import the survey.js module


app.use(contextPath,surveyRouter); // Use the survey routing module
app.use(contextPath+'/oauth',oauthRouter); // Use the oauth routing module
app.use(contextPath+'/web3',web3Router); // Use the oauth routing module
app.use(contextPath+'/account',account); // Use the oauth routing module


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});