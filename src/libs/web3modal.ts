
import * as UAuthWeb3Modal from '@uauth/web3modal'
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
  clientID: 'ZrIVOhdhBIXNDpq5znOsBHYy5fpra14x',
  clientSecret: '4zAvs6k7l7BsjhDK4qwm5LtFzaZTdCcf',
  redirectUri: (window as any).location.host,
  scope: 'openid wallet',
}

const providerOptions = {
  'custom-uauth': {
    // The UI Assets
    display: UAuthWeb3Modal.display,

    // The Connector
    connector: UAuthWeb3Modal.connector,

    // The SPA libary
    package: UAuthSPA,

    // The SPA libary options
    options: uauthOptions,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "774b1e4252de48c3997d66ac5f5078d8",
      rpc: getChainRpcInfos(),
    },
  },
}

const web3modal = new Web3Modal({cacheProvider: true, providerOptions})

// Register the web3modal so the connector has access to it.
UAuthWeb3Modal.registerWeb3Modal(web3modal)

export default web3modal