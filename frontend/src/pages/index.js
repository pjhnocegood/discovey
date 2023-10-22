import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { subDays, subHours } from 'date-fns';
import { RegisterPush } from 'src/sections/overview/register-push';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getEthereumAddress, getPrivateKey } from '../utils/storageUtil';
import { kvServiceAPi, nextAPi, proofServiceAPi } from '../utils/axiosUtil';
import { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_KV_GITHUB_CLIENT_ID } from '../const/commonConst';
import { signMessage } from '../utils/signUtil';
import {GithubNextId} from "../sections/oauth/githubNextId";

const now = new Date();


const Page = ({oauth}) => {
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

    if(code!==undefined && prevUser!==undefined && oauth === 'discovey'){
      gitHubIntegrationByKv();
    }
  },[prevUser])

  const gitHubIntegrationByKv = async async => {

    const data = {
      code: code,
      avatar: accountInfo.ids[0].avatar,
      ethereumAddress: getEthereumAddress(),
    }
    const response = await nextAPi.post('oauth/github/discovey', data
    )
    const userInfo = {...prevUser};
    userInfo.oauth.githubInfo = response.data.githubInfo;
    userInfo.oauth.gitHubInfoSignature = response.data.gitHubInfoSignature;

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
    router.push('/');

  }

  return (
  <>
    <Head>
      <title>
        Account
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        {(code !==undefined && oauth === 'nextid')  &&   <GithubNextId code={code}></GithubNextId>}
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Account
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile />
              </Grid>
            </Grid>
          </div>
        </Stack>

        <div >
            <Typography variant="h4" sx ={{mt:6}}>
              Mission
            </Typography>
          </div>
        <Grid  sx ={{mt:1}}
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value="10 DOY"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              gitHubIntegrationByKv={oauthGithubByKv}
              value="10 DOY"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              difference={16}
              oauthGithub={oauthGithub}
              positive={false}
              sx={{ height: '100%' }}
              value="10 DOY"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <RegisterPush
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value="10 DOY"
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value="10 DOY"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
}
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
