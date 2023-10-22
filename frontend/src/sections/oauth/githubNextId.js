import { nextAPi, proofServiceAPi } from '../../utils/axiosUtil';
import { getEthereumAddress, getPrivateKey, getPublicKey } from '../../utils/storageUtil';
import { signMessage } from '../../utils/signUtil';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const GithubNextId = ({code}) => {
  const router = useRouter();
  useEffect(()=>{
   gitHubIntegration();

  },[])
  async function createGist(avatar) {

    try {

      const data = {
        code :code,
        avatar:avatar,
        public_key:getPublicKey(),
      }

      const userResponse = await nextAPi.post('oauth/github',data)
      const githubPayload ={
        action:"create",
        platform:"github",
        identity:userResponse.data.id,
        public_key:getPublicKey()
      }
      console.log(userResponse)
      const payloadResponse =await proofServiceAPi.post('v1/proof/payload',githubPayload);

      const gistData = {
        accessToken :userResponse.data.accessToken,
        fileName:avatar+'.json',
        ethereumAddress: getEthereumAddress(),
        gistInfo:{
          version: "1",
          comment: "Here's a NextID proof of this Github account.",
          comment2: "To validate, base64.decode the signature, and recover pubkey from it using sign_payload with ethereum personal_sign algo.",
          persona: avatar,
          github_username: userResponse.data.id,
          sign_payload: payloadResponse.data.sign_payload,
          signature: await signMessage(payloadResponse.data.sign_payload,getPrivateKey()),
          created_at: payloadResponse.data.created_at,
          uuid: payloadResponse.data.uuid
        }
      }

      const gistResponse = await nextAPi.post('oauth/gist',gistData)

      const githubProofData = {
        action:"create",
        platform:"github",
        identity:userResponse.data.id,
        public_key:getPublicKey(),
        proof_location :  gistResponse.data.id,
        extra:{},
        created_at: payloadResponse.data.created_at,
        uuid: payloadResponse.data.uuid,


      }

      await proofServiceAPi.post('v1/proof', githubProofData)
      router.push('/');

      alert('깃허브 연동 되었습니다.')

    } catch (error) {
      console.error('An error occurred:', error);
    }
  }




  async function gitHubIntegration(){
    const platform='ethereum';
    const identity=getEthereumAddress();

    const accountResponse =await proofServiceAPi.get(`v1/proof?platform=${platform}&identity=${identity}`)
    const avatar = accountResponse.data.ids[0].avatar
    await createGist(avatar)

  }
  return <div>aa</div>
}
