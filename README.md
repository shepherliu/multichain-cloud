# cloud-vue3

***Introduction:***

Cloud-vue3 is is a web3 cloud dapp which you can easily manage your files and folders and even websites by using the distributed storage.

The dapp also has a builtin NFT marketpalce that you can mint your own nft with your uploaded images, audios and videos. And people can vote to like or dislike the nfts, and also can pay to reward the NFTs so that the creators can earn through the NFTs.

We use smart contract as the file manager to store the file indexs, and we build an nft contract called Web3NFT, that is cool and representative to the future.

To keep the high quality of the NFTs, the total supply has a limit of max 15000, and the max number of one user can mint is set to 10. And we will also disbale the mint and claim function for users who got more than 1000 unlikes about their NFTs. Thus people should burn their low quality NFTs and mint high quality NFTs instead.


***How it runs***:

  *0. make sure you are using linux system installed with git, node, npm .etc.*

  *1. clone this project*
    
    git clone https://github.com/shepherliu/cloud-vue3.git
    
  *2. cd this project*
  
    cd cloud-vue3
    
  *3. install dependencies*

    npm install
    
  *4. run it on https://localhost:8080/*
  
    npm run serve
    
  *5. build it for production*
  
    npm run build
    
  *6. see our daemon website https://cloud-vue3.vercel.app*
  
  *7. see our daemon video*


***How it works***:

<img width="980" alt="截屏2022-05-05 16 05 58" src="https://user-images.githubusercontent.com/84829620/166884452-e25d098f-f9e9-421f-9c45-b919f64ca68f.png">

  First you need select a file, a folder or a wehsite (also a folder which contains an index.html in the dir root path), then click the upload button.
  
  Then the file, folder or website you selected will be uploaded to the Decentralized Storage. Now we fully surpport the Filcoin Network through Web3storage package, and in the future we will also surport the Arweave Network and Swarm Network.
  
  After success uploaded to the Decentralized Storage, it will return the file id to the dapp, and we will upload the file name and file id to the filemanager smart contract.
  
  Finally all the uploaded file, folder and website will show on the dapp web pages. Now we are support to mint NFTs with the uploaded images, audios and videos.
  
***Future Plans***:

   *1. Multi Chain Full Support.*
   
   *2. Swarm Storage Full Support.*
   
   *3. Arweave Storage Full Support.*
   
   *4. NFT Buy And Sell In App.*
   
   *5. File/Folder Encrypt And Decrypt Support.*
   
   *6. AI NFT Create Support.*
   
***Resources:***

*1. Block Chain Resource Docs:*

   getting started with Ploygon Network: https://docs.polygon.technology/, https://faucet.polygon.technology/
   
   getting started with Boba Network: https://docs.boba.network/
   
   getting started with Metis Network: https://docs.metis.io/

*2. Distributed Storage Resource Docs:*

   getting started wit IPFS & Filecoin:  https://bitly.protocol.ai/IPFS_Filecoin_Get_Started
   
   getting started wit Web3Storage: https://web3.storage/docs/
   
   getting started wit Swarm: https://docs.ethswarm.org/docs/, https://github.com/ethersphere/bee
   
   getting started with Bundlr Network: https://docs.bundlr.network/, https://github.com/Bundlr-Network

*3. Transak Docs:*

   getting started wit Transak: https://integrate.transak.com/

*4. Smart contract Resource Docs:*

   online solidity compilier: https://remix.ethereum.org/
   
   getting started with ethers.js: https://docs.ethers.io/v5/
   
   getting started with solidity: https://docs.soliditylang.org/en/latest/
   
*5. Fronted Resource Docs:*

   getting started with Vue3: https://vuejs.org/guide/introduction.html
   
   getting started with Element Ui: https://element-plus.org/en-US/component/menu.html
