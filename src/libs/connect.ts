// example imports 
import { providers, utils, Contract } from "ethers"

export const connectState = {
  provider: new providers.Web3Provider((window as any).ethereum),
  chainId: 28,
  chainName: '',
  userAddr: '',
  currency: 'BOBA',
  signer: Object(),
  signed: false,
  bundlrProvider: Object(),
};

//connect to metamask wallet
export const networkConnect = async () => {

  const res = await connectState.provider.send("eth_requestAccounts", []);

  if(res.length > 0){
    //user address changed
    if(connectState.userAddr !== res[0]){
      connectState.bundlrProvider = null;
    }

    //user address
    connectState.userAddr = res[0];

    return await detectNetwork();

  }else{
    return false;
  }
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

  return true;  
}

//disconnect to metamask wallet
export const cancelConnect = async () => {
  connectState.userAddr = "";
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
  (window as any).ethereum.on('networkChanged', async () => {
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