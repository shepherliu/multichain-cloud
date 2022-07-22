import CryptoJS from 'crypto-js';
import { encrypt, recoverPersonalSignature } from '@metamask/eth-sig-util';

import { setLocalStorage, getLocalStorage } from "./localstorage"
import { connectState } from "./connect"

export const ETHVersion = 'x25519-xsalsa20-poly1305';

export const generateRandom256Bits = (account: string = '') => {
	if(account === ''){
		account = connectState.userAddr.value.toLowerCase();
	}else{
		account = account.toLowerCase();
	}

	const rb = CryptoJS.lib.WordArray.random(256 / 8);

	return (
		'Encryption key of this bits from ' +
		account +
		' is ' +
		rb.toString(CryptoJS.enc.Base64)
	);
}

export const getPublicKey = async (account: string = '') => {
	if(account === ''){
		account = connectState.userAddr.value.toLowerCase();
	}else{
		account = account.toLowerCase();
	}

	const localStorageKey = `${account}_wallet_public_key`;

	let publicKey = getLocalStorage(localStorageKey);

	if(publicKey != null){
		return publicKey;
	}

	try{
		publicKey = await connectState.provider.send("eth_getEncryptionPublicKey", [account]);
		if(publicKey != null){
			setLocalStorage(localStorageKey, publicKey);
			return publicKey;
		}
	}catch(e){
		return null;
	}
}

export const getPersonalSign = async (data:string) => {
	const account = connectState.userAddr.value.toLowerCase();

	try{
		return await connectState.provider.send("personal_sign", [`0x${Buffer.from(data, 'utf8').toString('hex')}` , account, '']);
	}catch(e){
		return null;
	}
}

export const recoverFromPersonalSign = async (sign_data:string, signature:string) => {
	try{
		return recoverPersonalSignature({
			data: sign_data,
			signature: signature,
		});
	}catch(e){
		return null;
	}
}

export const verifyPersonalSign = async (sign_data:string, signature:string, account:string) => {
	if(account === ''){
		account = connectState.userAddr.value.toLowerCase();
	}else{
		account = account.toLowerCase();
	}

	try{
		const recoverAddress = await recoverFromPersonalSign(sign_data, signature);

		return recoverAddress?.toLowerCase() === account;
	}catch(e){
		return false;
	}
}

export const encryptPasswordWithWallet = async (password:string, account:string = '') => {
	if(account === ''){
		account = connectState.userAddr.value.toLowerCase();
	}else{
		account = account.toLowerCase();
	}

	const publicKey = await getPublicKey(account);

	if(publicKey === null){
		return null;
	}

	const sign_data = Buffer.from(
		JSON.stringify(
			encrypt({
				publicKey: publicKey,
				data: password,
				version: ETHVersion,
			}),
		),
	).toString('base64');

	const signature = await getPersonalSign(sign_data);

	return {sign_data: sign_data, signature: signature};
}

export const decryptPasswordWithWallet = async (encrypt_password:any, account:string = '') => {

	const sign_data = encrypt_password?.sign_data;
	const signature = encrypt_password?.signature;

	if(!verifyPersonalSign(sign_data, signature, account)){
		return null;
	}

	const userAddr = connectState.userAddr.value;

	try{	
		return await connectState.provider.send("eth_decrypt", [Buffer.from(sign_data, 'base64').toString(), userAddr]);
	}catch(e){
		return null;
	}
}

const convertWordArrayToUint8Array = (wordArray: any) => {
  const arrayOfWords = wordArray.words ? wordArray.words : [];

  const length = wordArray.sigBytes ? wordArray.sigBytes : arrayOfWords.length * 4;

  const uInt8Array = new Uint8Array(length);

  let index = 0;

  for (let i = 0; i < length; i++) {
    const word = arrayOfWords[i];
    uInt8Array[index++] = word >> 24;
    uInt8Array[index++] = (word >> 16) & 0xff;
    uInt8Array[index++] = (word >> 8) & 0xff;
    uInt8Array[index++] = word & 0xff;
  }

  return uInt8Array;
}

export const encryptDataWithCryptoJs = async (data:any, password:string = '') => {
	data = CryptoJS.lib.WordArray.create(data);

	return CryptoJS.AES.encrypt(data, password).toString();
}

export const decryptDataWithCryptoJs = async (encrypt_data:any, password:string) => {

	const res = CryptoJS.AES.decrypt(encrypt_data, password);

	return convertWordArrayToUint8Array(res);
}