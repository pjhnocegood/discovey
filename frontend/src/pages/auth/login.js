import { useCallback, useState } from 'react';
import { Web3Auth } from "@web3auth/modal";
import Head from 'next/head';
import NextLink from 'next/link';
const Web3 = require('web3');
import {ec} from 'elliptic';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import {signMessage} from "../../utils/signUtil";
import { getEthereumAddress, getPrivateKey, getPublicKey } from '../../utils/storageUtil';
import { proofServiceAPi } from '../../utils/axiosUtil';


const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  const loginByWeb3Auth = async (e) => {
      e.preventDefault()

      const web3auth = new Web3Auth({
          clientId: "BIcW9IBC5g8jwVc9Bb8TeCMOxtPp8eQiwSVUArln7LvT2BohB-RhtwJIi91q5S-pIoo29IIFNP3KkKi952_0LlA", // Get your Client ID from the Web3Auth Dashboard
          web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
          chainConfig: {
              chainNamespace: "eip155",
              chainId: "0x1",
              rpcTarget: "https://rpc.ankr.com/eth",
              displayName: "Ethereum Mainnet",
              blockExplorer: "https://goerli.etherscan.io",
              ticker: "ETH",
              tickerName: "Ethereum",
          },
      });

      await web3auth.initModal();

      await web3auth.connect();
      const provider = web3auth.provider;
      const privateKey = await provider.request({ method: 'eth_private_key' });
      console.log(privateKey)


      const secp256k1 = new ec('secp256k1');
      const key = secp256k1.keyFromPrivate(privateKey);
      const generatedPublicKey = key.getPublic('hex'); // 16진수 형식의 공개 키
      const account = Web3.eth.accounts.privateKeyToAccount("0x"+privateKey);
      const ethereumAddress = account.address

      sessionStorage.setItem('nextPirvateKey', privateKey);
      sessionStorage.setItem('nextPublicKey', generatedPublicKey);
      sessionStorage.setItem('ethereumAddress', ethereumAddress);

      const platform = 'ethereum';
      const identity = getEthereumAddress();



      const accountResponse = await proofServiceAPi.get(`v1/proof?platform=${platform}&identity=${identity}`);
      console.log(accountResponse);
      if (accountResponse && accountResponse.data && accountResponse.data.ids) {
        const avatar = accountResponse.data.ids[0].avatar
        sessionStorage.setItem('avatar', avatar);
      } else {
      const payloadData = {
        action: 'create',
        platform: 'ethereum',
        identity: getEthereumAddress(),
        public_key: getPublicKey(),
    };
    
    // POST 요청 보내기
    const payloadResponse = await proofServiceAPi.post('v1/proof/payload', payloadData)
    const signature = await signMessage(payloadResponse.data.sign_payload,getPrivateKey());
    
    const proofData = {
        action: "create",
        platform: "ethereum",
        identity: ethereumAddress,
        public_key: getPublicKey(),
        extra: {
            wallet_signature: signature,
            signature: signature
        },
        uuid: payloadResponse.data.uuid,
        created_at: payloadResponse.data.created_at
    };
    
    const proofResponse = await proofServiceAPi.post('v1/proof', proofData)
  }
      router.push('/');
  }


  const handleSkip = useCallback(
    () => {
      auth.skip();
      router.push('/');
    },
    [auth, router]
  );

  return (
    <>
      <Head>
        <title>
          Login | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
              Start the journey of discovery.
              </Typography>

            </Stack>

              <form
                noValidate
                onSubmit={loginByWeb3Auth}
              >

                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Login with Web3AUth
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                </Button>

              </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
