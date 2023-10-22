

export const getPrivateKey =  () => {

    return sessionStorage.getItem("nextPirvateKey");
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


