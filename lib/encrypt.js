  const nacl = require('tweetnacl')
  nacl.util = require('tweetnacl-util')

  const getPair = () => {
    let {secretKey, publicKey} = nacl.box.keyPair();
    return {
      secretKey: nacl.util.encodeBase64(secretKey),
      publicKey: nacl.util.encodeBase64(publicKey),  
    }
  }

  const createNonce = () => nacl.util.encodeBase64(nacl.randomBytes(nacl.secretbox.nonceLength));

  function encrypt(message, nonce, sender, dest) {

  	let box = nacl.box(nacl.util.decodeUTF8(message), nacl.util.decodeBase64(nonce), nacl.util.decodeBase64(dest), nacl.util.decodeBase64(sender));
  	return nacl.util.encodeBase64(box);
  }

  function decrypt(message, nonce, sender, dest) {
    message = nacl.util.decodeBase64(message);
    nonce = nacl.util.decodeBase64(nonce);
    dest = nacl.util.decodeBase64(dest);
    sender =  nacl.util.decodeBase64(sender);

    const box = nacl.box.open(message, nonce, sender, dest);
    return nacl.util.encodeUTF8(box);
  }

  export {getPair, createNonce, encrypt, decrypt};