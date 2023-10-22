const { ecsign, toRpcSig, keccakFromString }  = require("ethereumjs-util");



 async function signMessage(message,privateKey){
   const secretKey = Buffer.from(privateKey, 'hex');
   const messageHash = keccakFromString(`\x19Ethereum Signed Message:\n${message.length}${message}`, 256)
   const signature = ecsign(messageHash, secretKey)

   return Buffer.from(toRpcSig(signature.v, signature.r, signature.s).slice(2), 'hex').toString('base64')
}

module.exports = { signMessage };


