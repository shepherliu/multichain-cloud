# multichain-cloud

***Introduction:***

multichain-cloud is is a web3 cloud dapp which you can easily manage your files and folders and even websites by using the distributed storage.

This is a web3 cloud dapp which you can easily upload your files and folders and even websites to the distributed storage such as Filcoin Network, Swarm Network and Arweave Network. And we use the smart contract as the file manager to search the file indexs, it is designed to be multi chains supported. 

The dapp also has a builtin NFT marketpalce called Web3NFT, so that you can mint your own nft with your uploaded images, audios and videos. And people can vote to like or dislike the nfts, and also can reward, sell and buy the NFTs so that the creators can earn through the NFTs. That is cool and representative to the future.

To keep the high quality of the NFTs, the total supply has a limit of max 15000, and the max number of one user can mint is set to 5. We make some simple dao functions for the NFT owners that they can create vote events such as to change the Max Supply or to change the Max Number that user can mint and so on. 

Remeber users whose NFTs got more than 1000 unlikes will be in blacklist, so that they will be disabled to mint and claim and even vote any more. Thus people should burn their low quality NFTs and mint high quality NFTs instead.


***How it runs***:

  *0. make sure you are using linux system installed with git, node, npm .etc.*

  *1. clone this project*
    
    git clone https://github.com/shepherliu/multichain-cloud.git
    
  *2. cd this project*
  
    cd multichain-cloud
    
  *3. install dependencies*

    npm install
    
  *4. run it on https://localhost:8080/*
  
    npm run serve
    
  *5. build it for production*
  
    npm run build
    
  *6. see our daemon website: https://multichain-cloud.vercel.app*

  *7  see our daemon full video https://youtu.be/yoDmrgYxWf4*
  
  *8. see daemon video sending nft with unstoppable domains api: https://youtu.be/Wza1ESuXDtQ*

  *9. see daemon video login in with unstoppable domains: https://youtu.be/0hidXL9Pc78*

***How it works***:

<img width="981" alt="2022-05-10 11 49 34" src="https://user-images.githubusercontent.com/84829620/167539118-8c52b2b3-3f09-48f1-974c-ce8d571fb813.png">

  First you need select a file, a folder or a wehsite (also a folder which contains an index.html in the dir root path), then click the upload button.
  
    1. src/components/UploadFile.vue is the fronted page to handle the upload events.

    2. src/libs/storage.ts is the virtual interface to upload files and folders.

    3. src/libs/web3storage.ts is the functions to upload files and folders to Filcoin Network through the web3storage.

    4. src/libs/swarm.ts is the functions to upload files and folders to Swarm Network through the swarmgateway(it will be opened in the future).

    5. src/libs/bundlr.ts is the functions to upload files and folders to Arweave Network through the bundlrnetwork(it will be opened in the future).
  
  Then the file, folder or website you selected will be uploaded to the Decentralized Storage. Now we fully surpport the Filcoin Network through Web3storage package, and in the future we will also surport the Arweave Network and Swarm Network.
  
  After success uploaded to the Decentralized Storage, it will return the file id to the dapp, and we will upload the file name and file id to the filemanager smart contract.
  
  Finally all the uploaded file, folder and website will show on the dapp web pages. Now we are support to mint NFTs with the uploaded images, audios and videos.
   
***Resources:***

*1. Block Chain Resource Docs:*

   getting started with Ploygon Network: https://docs.polygon.technology/, https://faucet.polygon.technology/
   
   getting started with Boba Network: https://docs.boba.network/
   
   getting started with Metis Network: https://docs.metis.io/

   getting started with Meter Network: https://docs.meter.io/developer-documentation/introduction

*2. Distributed Storage Resource Docs:*

   getting started wit IPFS & Filecoin:  https://bitly.protocol.ai/IPFS_Filecoin_Get_Started
   
   getting started wit Web3Storage: https://web3.storage/docs/
   
   getting started wit Swarm: https://docs.ethswarm.org/docs/, https://github.com/ethersphere/bee
   
   getting started with Bundlr Network: https://docs.bundlr.network/, https://github.com/Bundlr-Network

*3. Transak Docs:*

   getting started wit Transak: https://integrate.transak.com/
   
*4. Unstoppable Domains:*

  unstoppable Domains Resolution API: https://docs.alchemy.com/alchemy/enhanced-apis/unstoppable-domains-apis

  NFT domains registry architecture: https://docs.unstoppabledomains.com/domain-registry-essentials/uns-vs-cns-comparison

  domain resolution SDKs: https://docs.unstoppabledomains.com/send-and-receive-crypto-payments/resolution-libraries 

  how to resolve domains using direct blockchain call (without SDK): https://docs.unstoppabledomains.com/send-and-receive-crypto-payments/direct-blockchain-calls 

  crypto payments integration guide: https://docs.unstoppabledomains.com/send-and-receive-crypto-payments/crypto-payments

*5. Smart contract Resource Docs:*

   online solidity compilier: https://chainide.com/, https://remix.ethereum.org/
   
   getting started with ethers.js: https://docs.ethers.io/v5/
   
   getting started with solidity: https://docs.soliditylang.org/en/latest/
   
*6. Fronted Resource Docs:*

   getting started with Vue3: https://vuejs.org/guide/introduction.html
   
   getting started with Element Ui: https://element-plus.org/en-US/component/menu.html
   
***Contract Me:***
  
   Email: shepher.liu@gmail.com

   Unstoppable Domain Register Email: shepher.liu@gmail.com
   
   Discord: swarmlover#4063
