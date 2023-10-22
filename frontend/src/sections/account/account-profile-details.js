import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { kvServiceAPi, nextAPi, proofServiceAPi } from '../../utils/axiosUtil';
import { getEthereumAddress, getPrivateKey } from '../../utils/storageUtil';
import { signMessage } from '../../utils/signUtil';
import { useRouter } from 'next/router';
import { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_KV_GITHUB_CLIENT_ID } from '../../const/commonConst';
import { GithubNextId } from '../oauth/githubNextId';


export const AccountProfileDetails = ({oauth}) => {
  const router = useRouter();
  const { query } = router;
  // 특정 쿼리 파라미터 값 가져오기
  const code = query.code;
  const [values, setValues] = useState({
    age: '',
    gender: '',
    hobby: '',
  });

  const [proofChain, setProofChain] = useState({});
  const [accountInfo, setAccountInfo] = useState({});

  const [user, setUser] = useState({
    gender: '',
    age: '',
    hobby: '',
    job: '',

    oauth:{
      githubInfo:{},
      gitHubInfoSignature:{}
    }
  });

  const [prevUser, setPrevUser] = useState();


  const handleChange = useCallback(
    (event) => {
      setUser((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  useEffect(() => {
    async function getAccountInfo() {
      const platform = 'ethereum';
      const identity = getEthereumAddress();

      const accountResponse = await proofServiceAPi.get(`v1/proof?platform=${platform}&identity=${identity}`)
      setAccountInfo(accountResponse.data)
      const avatar = accountResponse.data.ids[0].avatar
      const kvdResponse = await kvServiceAPi.get(`v1/kv?avatar=${avatar}`)

      const proofChainResponse = await proofServiceAPi.get(`v1/proofchain?avatar=${avatar}`)

      let gitHubConfirmed = false;
      let gitHubId = '';
      proofChainResponse.data.proof_chain.forEach((proofChain) => {
        if (proofChain.platform === 'github') {
          gitHubConfirmed = true;
          gitHubId = proofChain.identity;
        }
      })
      const proofChainData = {
        gitHubConfirmed: gitHubConfirmed,
        githubId: gitHubId
      }

      setProofChain(proofChainData)

      if (kvdResponse.data.proofs[0]?.content !== undefined) {
        setUser(kvdResponse.data.proofs[0]?.content)
        setPrevUser(kvdResponse.data.proofs[0]?.content)
      }else{
        setPrevUser(user)
      }
    }
      getAccountInfo();
  }, [])

  useEffect(()=>{
    if(code!==undefined && prevUser!==undefined){
      gitHubIntegrationByKv();
    }
  },[code,prevUser])

  const gitHubIntegrationByKv = async async => {

    const data = {
      code: code,
      avatar: accountInfo.ids[0].avatar
    }
    const response = await nextAPi.post('oauth/github/discovey', data
    )
    const userInfo = {...prevUser};
    userInfo.oauth.githubInfo = response.data.githubInfo;
    userInfo.oauth.gitHubInfoSignature = response.data.gitHubInfoSignature;
    console.log(userInfo)
    console.log(user)
    changeUserInfo(userInfo)
  }

  const oauthGithub = async () => {
    // GitHub OAuth 로그인 URL 생성
    // OAuth 로그인을 시작하고 GitHub로 리디렉션

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${REACT_APP_GITHUB_CLIENT_ID}&scope=user,gist`;
  }

  const oauthGithubByKv = async () => {
    // GitHub OAuth 로그인 URL 생성
    // OAuth 로그인을 시작하고 GitHub으로 리디렉션
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${REACT_APP_KV_GITHUB_CLIENT_ID}&scope=user`;
  }

  const changeUserInfo = async () => {
    const payloadData = {
      avatar: accountInfo.ids[0].avatar,
      identity: accountInfo.ids[0].avatar,
      platform: "nextid",
      patch: user,
    };

    // POST 요청 보내기
    const payloadResponse = await kvServiceAPi.post('v1/kv/payload', payloadData)

    const patchData = {
      avatar: accountInfo.ids[0].avatar,
      identity: accountInfo.ids[0].avatar,
      platform: "nextid",
      uuid: payloadResponse.data.uuid,
      created_at: payloadResponse.data.created_at,
      signature: await signMessage(payloadResponse.data.sign_payload,getPrivateKey()),
      patch: user,
    };

    const patchResponse = await kvServiceAPi.post('v1/kv', patchData)

    alert('개인정보 저장 되었습니다.')
    router.push(router.pathname);

  }

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>

        {(code !==undefined && oauth === 'nextid')  &&   <GithubNextId code={code}></GithubNextId>}
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="age"
                  name="age"
                  onChange={handleChange}
                  required
                  value={user.age}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="gender"
                  name="gender"
                  onChange={handleChange}
                  required
                  value={user.gender}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="hobby"
                  name="hobby"
                  onChange={handleChange}
                  required
                  value={user.hobby}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="job"
                  name="job"
                  onChange={handleChange}
                  required
                  value={user.job}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {
                  proofChain.gitHubConfirmed ?   <div>GitHub(nextId) : { proofChain.githubId}  </div>
                    :     <Button  onClick={oauthGithub}>GitHub integration By NextId</Button>
                }
                </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {
                  user.oauth.githubInfo.id===undefined || user.oauth.githubInfo.id==='' ?
                    <Button onClick={oauthGithubByKv}>GitHub integration By Discovey</Button>
                    :
                    <div>
                      GitHubId(Discovey):{user.oauth.githubInfo.id}
                    </div>

                }
              </Grid>


            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={changeUserInfo}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
