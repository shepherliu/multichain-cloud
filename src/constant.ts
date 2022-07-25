//transak url
export const transakUrl = 'https://staging-global.transak.com/?apiKey=5aed5b3c-fbce-45ec-a62b-f835254ea9f9'

//swarm ts-tar metafile name
export const META_FILE_NAME = '.swarmgatewaymeta.json';

//web3 storage url
export const web3StorageHost = 'https://api.web3.storage';

//web3 storage appkey
export const web3StorageAppKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJlY0Q2MDVmZGZiNWVFRTdhYUZlYmVhNzUxMjVCMDBCNDkzMDMxOUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTEzNjE4MTAwNDIsIm5hbWUiOiJ0ZXN0In0.SqcXP8E9fJEQ_7AGjrHaliBsoKCl2l2mA2q1-Lejkp4';

//ipfs api
export const ipfsHost = "https://dweb.link";

//swarm api getway for download files from swarm
export const swarmGateway = "https://api.gateway.ethswarm.org/bzz/";

//swarm api gateway for upload files to swarm
export const swarmGatewayList = [
  "https://gateway-proxy-bee-0-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-1-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-2-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-3-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-4-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-5-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-6-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-7-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-8-0.gateway.ethswarm.org/bzz",
  "https://gateway-proxy-bee-9-0.gateway.ethswarm.org/bzz"
];
//arweave mainnet url
export const arweaveUrl = "https://arweave.net/";

//arweave testnet url
export const arweaveTestUrl = "https://arweave.net/";

//boba mainnet url
export const bundlrUrl = "https://node1.bundlr.network";

//boba testnet url
export const bundlrTestUrl = "https://devnet.bundlr.network";

//boba toekn testnet contract address 
export const bobaTestContractAddress = "0xF5B97a4860c1D81A1e915C40EcCB5E4a5E6b8309";

//file contract address
export const fileContractAddress = {
  4: "0xd2ed8Ac64BDb92F7e942c360060E4811fCbd123a",
  5: "0xa9376e8B93693D2EC2D648B3d0F6108e743F6b11",
  50: "0x2Ff04e34aeaC3757dFb317bC5072547AdFEeFA40",
  80001: "0xEF4671692A5BD16DE1AEde478A75827385aA8D33",
};

//nft contract address
export const nftContractAddress = {
  4: "0xbf753D281d530AF1c1953977C029eaCD8baeA68a",
  5: "0x324F96D796eEFF2de8b9c58067b129e8290d1bA5",
  50: "0xC781D6c0FE604eb04c83018255304E027C93aC73",
  80001: "0xE24C3bc18465782F8498d13398d4513C26698091",
};

//vote contract address
export const voteContractAddress = {
  4: "0x079B90B2De1Dd1D84C65D08575ba44b4facB548D",
  5: "0xC80A496cdDDb01257d554a1Db9aa3Db917a9A8AD",
  50: "0x5EB533ad6a1D2cB3C02c8ec96229005bE3190046",
  80001: "0x63A44b45dE9dE05B2868a2d3F7F798f4e079e134",
}

//token List
export const tokenList = {
  1: ['ETH'],
  3: ['ETH'],
  4: ['ETH'],
  5: ['ETH'],
  10: ['ETH'],
  28: ['BOBA', 'ETH'],
  42: ['ETH'],
  50: ['XDC'],  
  56: ['BNB'],
  66: ['OKT'],  
  82: ['MTR'],
  83: ['MTR'],
  100: ['xDAI'],
  128: ['HT'],
  137: ['MATIC'],  
  250: ['FTM'],
  288: ['BOBA', 'ETH'],
  588: ['METIS', 'ETH'],
  1088: ['METIS', 'ETH'],
  2828: ['LYXT'],
  4689: ['IOTX'],
  42161: ['ETH'],
  43114: ['AVAX'],
  80001: ['MATIC'],
};

//chain list
export const chainList = [
  {
    chainId: 1,
    chainName: 'Ethereum Chain Mainnet',
    nativeCurrency: 'ETH',
    rpcUrls: "https://mainnet.infura.io/v3",
    blockExplorerUrls: "https://etherscan.io",
  },
  {
    chainId: 3,
    chainName: 'Ropsten Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://ropsten.infura.io/v3',
    blockExplorerUrls: 'https://ropsten.etherscan.io',
  },
  {
    chainId: 4,
    chainName: 'Rinkeby Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://rinkeby.infura.io/v3',
    blockExplorerUrls: 'https://rinkeby.etherscan.io',
  },
  {
    chainId: 5,
    chainName: 'Goerli Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://goerli.infura.io/v3',
    blockExplorerUrls: 'https://goerli.etherscan.io',
  },
  {
    chainId: 10,
    chainName: 'Optimistic Chain Mainnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://mainnet.optimism.io',
    blockExplorerUrls: 'https://optimism.io',
  },  
  {
    chainId: 28,
    chainName: 'Boba Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://rinkeby.boba.network',
    blockExplorerUrls: 'https://blockexplorer.rinkeby.boba.network',
  },    
  {
    chainId: 42,
    chainName: 'Kovan Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://kovan.infura.io/v3',
    blockExplorerUrls: 'https://kovan.etherscan.io',
  },
  {
    chainId: 50,
    chainName: 'XDC Chain Mainnet',
    nativeCurrency: 'XDC',
    rpcUrls: 'https://rpc.xinfin.network',
    blockExplorerUrls: 'https://explorer.xinfin.network',
  },  
  {
    chainId: 56,
    chainName: 'BSC Chain Mainnet',
    nativeCurrency: 'BNB',
    rpcUrls: 'https://bsc-dataseed.binance.org',
    blockExplorerUrls: 'https://bscscan.com',
  },
  {
    chainId: 66,
    chainName: 'OKEx Chain Mainnet',
    nativeCurrency: 'OKT',
    rpcUrls: 'https://exchainrpc.okex.org',
    blockExplorerUrls: 'https://www.oklink.com/okexchain',
  },  
  {
    chainId: 82,
    chainName: 'Meter Chain Mainnet',
    nativeCurrency: 'MTR',
    rpcUrls: 'https://rpc.meter.io',
    blockExplorerUrls: 'https://scan.meter.io',
  },  
  {
    chainId: 83,
    chainName: 'Meter Chain Testnet',
    nativeCurrency: 'MTR',
    rpcUrls: 'https://rpctest.meter.io',
    blockExplorerUrls: 'https://scan-warringstakes.meter.io',
  },      
  {
    chainId: 100,
    chainName: "Gnosis Chain Mainnet",
    nativeCurrency: "xDAI",
    rpcUrls: 'https://rpc.xdaichain.com',
    blockExplorerUrls: 'https://blockscout.com/poa/xdai',
  },
  {
    chainId: 128,
    chainName: 'Heco Chain Mainnet',
    nativeCurrency: 'HT',
    rpcUrls: 'https://http-mainnet-node.huobichain.com',
    blockExplorerUrls: 'https://hecoinfo.com',
  },
  {
    chainId: 137,
    chainName: 'Polygon Chain Mainnet',
    nativeCurrency: 'MATIC',
    rpcUrls: 'https://rpc-mainnet.matic.network',
    blockExplorerUrls: 'https://polygonscan.com',
  },  
  {
    chainId: 250,
    chainName: 'Fantom Chain Mainnet',
    nativeCurrency: 'FTM',
    rpcUrls: 'https://rpc.ftm.tools',
    blockExplorerUrls: 'https://ftmscan.com',    
  },  
  {
    chainId: 288,
    chainName: 'Boba Chain Mainnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://mainnet.boba.network',
    blockExplorerUrls: 'https://blockexplorer.boba.network',
  },
  {
    chainId: 588,
    chainName: 'Metis Stardust Testnet',
    nativeCurrency: 'METIS',
    rpcUrls: 'https://stardust.metis.io/?owner=588',
    blockExplorerUrls: 'https://stardust-explorer.metis.io',
  },
  {
    chainId: 1088,
    chainName: 'Metis Andromeda Mainnet',
    nativeCurrency: 'METIS',
    rpcUrls: 'https://andromeda.metis.io/?owner=1088',
    blockExplorerUrls: 'https://andromeda-explorer.metis.io',
  },    
  {
    chainId: 2828,
    chainName: 'KUKSO Test network',
    nativeCurrency: 'LYXT',
    rpcUrls: 'https://rpc.l16.lukso.network',
    blockExplorerUrls: 'https://explorer.execution.l16.lukso.network',
  },  
  {
    chainId: 4689,
    chainName: 'IoTex Chain Mainnet',
    nativeCurrency: 'IOTX',
    rpcUrls: 'https://babel-api.mainnet.iotex.io',
    blockExplorerUrls: 'https://iotexscan.io',
  },  
  {
    chainId: 42161,
    chainName: 'Arbitrum Chain Mainnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrls: 'https://arbiscan.io',
  },  
  {
    chainId: 43114,
    chainName: 'AVAX Chain Mainnet',
    nativeCurrency: 'AVAX',
    rpcUrls: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorerUrls: 'https://cchain.explorer.avax.network',
  },
  {
    chainId: 80001,
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: 'MATIC',
    rpcUrls: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrls: 'https://mumbai.polygonscan.com',
  },  
];