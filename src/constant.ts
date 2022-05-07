//transak url
export const transakUrl = 'https://staging-global.transak.com/?apiKey=5aed5b3c-fbce-45ec-a62b-f835254ea9f9'

//swarm ts-tar metafile name
export const META_FILE_NAME = '.swarmgatewaymeta.json';

//web3 storage appkey
export const web3StorageAppKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEJlY0Q2MDVmZGZiNWVFRTdhYUZlYmVhNzUxMjVCMDBCNDkzMDMxOUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTEzNjE4MTAwNDIsIm5hbWUiOiJ0ZXN0In0.SqcXP8E9fJEQ_7AGjrHaliBsoKCl2l2mA2q1-Lejkp4';

//web3 gateway
export const web3Gateway = "https://dweb.link/ipfs/"

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
  4: "0xf59a1dB4593B748Fe1b94cb6646bA1b32a4b26DD",
  28: "0x65e6e482BF7cd0A1B454e6756Df9da24Fbe7d424",
  83: "0xfB296908fDD00C655609B74C8BF418dB7cC5407b",
  588: "0xA5a275096AA2512E2FC32c003e87dd9fae7515C3",
  80001: "0x5755579e4ed12d114ccdab4ae69c99eb00479476",
};

//nft contract address
export const nftContractAddress = {
  4: "0xC28290C8C16b8C8a27733315ab7A86cc0A5F643E",
  28: "0x6EEe74D7309cF800FA51454583c652f4910789DF",
  83: "0x706e4dBbb8833d36FDdb1dc5a8C0C88342fA60f3",
  588: "0xC8ee8f35568851e8b886569E40B6cd35dE944fe3",
  80001: "0xB02a5deFc7c599cfa039a8cC21572DEff8822699",
};

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
    rpcUrls: "https://mainnet.infura.io/v3/",
    blockExplorerUrls: "https://etherscan.io",
  },
  {
    chainId: 3,
    chainName: 'Ropsten Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://ropsten.infura.io/v3/',
    blockExplorerUrls: 'https://ropsten.etherscan.io',
  },
  {
    chainId: 4,
    chainName: 'Rinkeby Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://rinkeby.infura.io/v3/',
    blockExplorerUrls: 'https://rinkeby.etherscan.io',
  },
  {
    chainId: 5,
    chainName: 'Goerli Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://goerli.infura.io/v3/',
    blockExplorerUrls: 'https://goerli.etherscan.io',
  },
  {
    chainId: 10,
    chainName: 'Optimistic Chain Mainnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://mainnet.optimism.io/',
    blockExplorerUrls: 'https://optimism.io',
  },  
  {
    chainId: 28,
    chainName: 'Boba Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://rinkeby.boba.network/',
    blockExplorerUrls: 'https://blockexplorer.rinkeby.boba.network/',
  },    
  {
    chainId: 42,
    chainName: 'Kovan Chain Testnet',
    nativeCurrency: 'ETH',
    rpcUrls: 'https://kovan.infura.io/v3/',
    blockExplorerUrls: 'https://kovan.etherscan.io',
  },
  {
    chainId: 50,
    chainName: 'XDC Chain Mainnet',
    nativeCurrency: 'XDC',
    rpcUrls: 'https://rpc.xinfin.network',
    blockExplorerUrls: 'https://explorer.xinfin.network/',
  },  
  {
    chainId: 56,
    chainName: 'BSC Chain Mainnet',
    nativeCurrency: 'BNB',
    rpcUrls: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrls: 'https://bscscan.com/',
  },
  {
    chainId: 66,
    chainName: 'OKEx Chain Mainnet',
    nativeCurrency: 'OKT',
    rpcUrls: 'https://exchainrpc.okex.org',
    blockExplorerUrls: 'https://www.oklink.com/okexchain/',
  },  
  {
    chainId: 82,
    chainName: 'Meter Chain Mainnet',
    nativeCurrency: 'MTR',
    rpcUrls: 'https://rpc.meter.io/',
    blockExplorerUrls: 'https://scan.meter.io/',
  },  
  {
    chainId: 83,
    chainName: 'Meter Chain Testnet',
    nativeCurrency: 'MTR',
    rpcUrls: 'https://rpctest.meter.io/',
    blockExplorerUrls: 'https://scan-warringstakes.meter.io/',
  },      
  {
    chainId: 100,
    chainName: "Gnosis Chain Mainnet",
    nativeCurrency: "xDAI",
    rpcUrls: 'https://rpc.xdaichain.com/',
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
    blockExplorerUrls: 'https://polygonscan.com/',
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