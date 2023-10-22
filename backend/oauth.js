const express = require('express');
const {gitHubTokenAPi, gitHubAPi} = require("./util/axiosUtil");
const {parse} = require("querystring");
const {post} = require("axios");
const {signMessage} = require("./util/signUtil");
require('dotenv').config();

const router = express.Router();

router.post('/github', async (req, res) => {
  try {
    const data = req.body; // You can access the request body

    const tokenData = {
      code:data.code,
      client_id:process.env.REACT_APP_GITHUB_CLIENT_ID,
      client_secret:process.env.REACT_APP_GITHUB_CLIENT_SECRET
    }
    console.log(tokenData)

    // Perform the necessary actions and send a response

    const  githubResponse =await post('https://github.com/login/oauth/access_token',tokenData)
    console.log(githubResponse.data)
    const accessToken = parse(githubResponse.data).access_token;
    console.log('accessToken :',accessToken)
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const gihubUserResponse = await post('https://api.github.com/user',{},{headers});
    console.log(gihubUserResponse.data)
    const login=gihubUserResponse.data.login;

    res.status(200).json({
      accessToken:accessToken,
      id:login,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

router.post('/gist', async (req, res) => {

  try {
    // Handle the POST request here
    const data = req.body; // You can access the request body
    const accessToken =data.accessToken;
    const fileName=data.fileName
    console.log('accessToken :',accessToken)
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    console.log(data.gistInfo)
    const gistData = {
      description: 'My Gist',
      public: true, // Gist의 공개 여부 (true 또는 false)
      files: {
        [fileName]: {
          content: JSON.stringify(data.gistInfo)
        },
      },
    };

    try {
      const githubGistResponse = await post('https://api.github.com/gists',gistData,{headers})
      console.log(githubGistResponse.data)
      res.status(200).json(githubGistResponse.data);
    } catch (error) {
      console.log(error)
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add' });
  }
});

router.post('/github/discovey', async (req, res) => {
  try {
    const data = req.body; // You can access the request body
    console.log(data)
    const tokenData = {
      code:data.code,
      client_id:process.env.REACT_APP_KV_GITHUB_CLIENT_ID,
      client_secret:process.env.REACT_APP_KV_GITHUB_CLIENT_SECRET
    }
    // Perform the necessary actions and send a response
    const  githubResponse =await post('https://github.com//login/oauth/access_token',tokenData)
    console.log(githubResponse.data)
    const accessToken = parse(githubResponse.data).access_token;
    console.log('accessToken :',accessToken)
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const githubUserResponse = await post('https://api.github.com/user',{},{headers});
    console.log(githubUserResponse.data)
    const login=githubUserResponse.data.login;

    const githubInfo = {
      id:login,
      avatar:data.avatar
    }

    const gitHubInfoSignature = await signMessage(JSON.stringify(githubInfo),process.env.SERVER_PRIVATE_KEY);


    res.status(200).json({
      githubInfo:githubInfo,
      gitHubInfoSignature:gitHubInfoSignature,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

module.exports = router;