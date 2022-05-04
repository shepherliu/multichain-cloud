// example imports 
import { providers, Contract } from "ethers"

import * as constant from '../constant'

import { shortString } from "./tools"

import { ref } from "vue"

export const connectState = {
  chainId: 288,
  chainName: '',
  userAddr: ref(''),
  shortAddr: ref(''),
  currency: 'BOBA',
  signed: false,
  provider: new providers.Web3Provider((window as any).ethereum),
  signer: Object(),
  storage: 'filcoin',
  web3Storage: '',
  bundlrProvider: Object(),
  activeIndex: ref(1),
  activeName: ref(''),
  search: '',
  searchCallback: async () => {},
  connectCallback: async () => {},
  transactions: ref(new Array()),
  transactionCount: ref(0),
};

//connect to metamask wallet
export const networkConnect = async () => {

  const res = await connectState.provider.send("eth_requestAccounts", []);

  if(res.length > 0){
    //user address changed
    if(connectState.userAddr.value !== res[0]){
      connectState.bundlrProvider = null;
    }

    //user address
    connectState.userAddr.value = res[0];

    return await detectNetwork();

  }else{
    return false;
  }
}

//detect currency
export const detectCurrency = async (chainId: number) => {
    const tokenList = (constant.tokenList as any)[chainId];
    for (const i in tokenList){
      if(connectState.currency === tokenList[i]){
        return;
      }
    }

    connectState.currency = tokenList[0];
}

//deteck network
export const detectNetwork = async () => {
  //detect block chain
  const res = await connectState.provider.detectNetwork();

  if(res.chainId == null || res.chainId == undefined){
    return false;
  }

  (connectState.provider.network as any).chainId = (res as any).chainId;
  (connectState.provider.network as any).chainName = (res as any).chainName;

  //signer
  connectState.signer = connectState.provider.getSigner();

  //chain id changed
  if(connectState.chainId !== res.chainId){
    connectState.bundlrProvider = null;
  }

  //chain id
  connectState.chainId = res.chainId;
  
  //chain name
  connectState.chainName = res.name;

  //chain token
  detectCurrency(res.chainId);

  //connect call back
  connectState.connectCallback();  

  return true;  
}

//disconnect to metamask wallet
export const cancelConnect = async () => {
  connectState.userAddr.value = "";
  connectState.chainId = 1;
  connectState.chainName = "";
  connectState.signer = null;
  connectState.bundlrProvider = null;
}

//on wallet account change
export const accountsChanged = async (accountsChanged:Function) => {
  (window as any).ethereum.on('accountsChanged', async () => {
    await accountsChanged();
  });
}

//on wallet netwokr change
export const networkChanged = async (networkChanged:Function) => {
  (window as any).ethereum.on('chainChanged', async () => {
    await networkChanged();
  });    
}

//check if wallet is connected or not
export const connected = () => {
    if((window as any).ethereum.selectedAddress === null || (window as any).ethereum.selectedAddress === undefined){
      return false;
    }  else {
      return true;
    }
}