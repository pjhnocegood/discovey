import {nextAPi} from "./axiosUtil";


export const getPrivateKey =  () => {

    return sessionStorage.getItem("nextPirvateKey");
}

export const getSafeAddress =  async () => {
    console.log(sessionStorage.getItem("safeAddress"))
    if(sessionStorage.getItem("safeAddress")===null || sessionStorage.getItem("safeAddress")==="" || sessionStorage.getItem("safeAddress")==='undefined'){
    
        const ethereumAddress = getEthereumAddress();
        const response = await nextAPi.get(`account/${ethereumAddress}`);

        sessionStorage.setItem("safeAddress", response.data[0].safe_wallet
        )
    }else {

    }

    return sessionStorage.getItem("safeAddress");
}

export const getEthereumAddress =  () => {

    return sessionStorage.getItem("ethereumAddress");
}

export const getPublicKey =  () => {

    return sessionStorage.getItem("nextPublicKey");
}

export const getAvatar =  () => {

  return sessionStorage.getItem("avatar");
}

export const getUserInfo =  () => {

  return sessionStorage.getItem("userInfo");
}


