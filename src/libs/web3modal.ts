
import * as UAuthWeb3Modal from '@uauth/web3modal'
import UAuth from '@uauth/js'
import UAuthSPA from '@uauth/js'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

import * as constant from '../constant'

const getChainRpcInfos = () => {
  const rpcList = {} as any;

  for(const i in constant.chainList){
    rpcList[ constant.chainList[i].chainId ] = constant.chainList[i].rpcUrls;
  }

  return rpcList;
}

export const uauthOptions: UAuthWeb3Modal.IUAuthOptions = {
  clientID: '948b22ce-98d1-4226-9769-4745b5a17315',
  redirectUri: (window as any).location.origin,
  scope: 'openid wallet',
}

const providerOptions = {
  'custom-uauth': {
    display: UAuthWeb3Modal.display,
    connector: UAuthWeb3Modal.connector,
    package: UAuthSPA,
    options: uauthOptions,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: constant.INFURA_ID,
      rpc: getChainRpcInfos(),
    },
  },
}

const web3modal = new Web3Modal({cacheProvider: true, providerOptions})

// Register the web3modal so the connector has access to it.
UAuthWeb3Modal.registerWeb3Modal(web3modal);

export const web3User = async () => {
  const uauth = new UAuth(uauthOptions);

  try {
    return await uauth.user();
  }catch(e){
    return null;
  }
}

export default web3modal