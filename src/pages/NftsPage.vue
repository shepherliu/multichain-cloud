<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="AllNfts" name="all"></el-tab-pane>
          <el-tab-pane label="MyNfts" name="mine"></el-tab-pane>
        </el-tabs>
        <el-link type="primary" @click="onClaimRewards()" style="float: right;">Claim : {{userRewards}}</el-link>
      </el-header>
      <el-main
        style="height: 450px;" 
        v-loading="loadStatus" 
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="#ffffff"
      >
        <el-row :gutter="20">
          <template v-for="nft in nftList" :key="nft[2]">
              <el-col :span="8">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>NFT ID: <a target="_blank" :href="tokenExplorerUrl(nft[0], nft[2])">{{nft[0]}}</a></span>
                      <el-button v-if="activeName==='mine'" size="small" type="danger" @click="onBurnNft(nft[0])">
                        Burn<el-icon><delete /></el-icon>
                      </el-button>
                    </div>
                  </template>
                  <img v-if="nft[1]==='image'" :src="nft[2]" style="width: 200px;height: 200px;" />
                  <audio v-if="nft[1]==='audio'" :src="nft[2]" controls preload style="width: 200px;height: 200px;" />
                  <video v-if="nft[1]==='video'" :src="nft[2]" controls preload style="width: 200px;height: 200px;" />
                  <div>
                    <el-link type="primary" @click="onLikeNft(nft[0])">Likes : {{nft[3]}}</el-link>
                    <el-link type="warning" @click="onHateNft(nft[0])">Hates : {{nft[4]}}</el-link>
                    <el-link type="success" @click="onRewardNft(nft[0])">Rewards : {{nft[5].toFixed(3)}}</el-link>
                  </div>
                </el-card>
              </el-col>
          </template>
        </el-row>
      </el-main>
      <el-footer>
        <div>
          <el-pagination
            background
            layout="total, prev, pager, next"
            v-model:currentPage="currentPage"
            :total="nftTotal"
            :page-size="pageSize"
            style="float: right;"
             @current-change="handleClick"
          />
      </div>
      </el-footer>
    </el-container>
  </div> 

</template>

<script lang="ts">
export default {
  name: 'NftsPage',
  props: {
  }
}
</script>

<script setup lang="ts">
import { ref } from "vue"
import { utils } from "ethers"

import * as web3nft from "../libs/web3nft"
import { connected, connectState } from "../libs/connect"
import * as element from "../libs/element"
import * as constant from "../constant"
import * as tools from "../libs/tools"

const activeName = ref("all");
const loadStatus = ref(false);
const userRewards = ref(0);
const pageSize = ref(3);
const currentPage = ref(0);
const nftTotal = ref(0);
const nftList = ref(new Array());  

//nft token explore url
const tokenExplorerUrl = (tokenId:number, tokenURI:string) => {
  for(const i in constant.chainList){
    if(connectState.chainId === constant.chainList[i].chainId){
      const blockExplorerUrls = constant.chainList[i].blockExplorerUrls;
      const nftContractAddress = (constant.nftContractAddress as any)[connectState.chainId]
      return blockExplorerUrls + '/token/' + nftContractAddress + '?a=' + tokenId + '#inventory';
    }
  }

  return tokenURI;
}

//transaction explore url
const transactionExplorerUrl = (transaction:string) => {
  for(const i in constant.chainList){
    if(connectState.chainId === constant.chainList[i].chainId){
      const blockExplorerUrls = constant.chainList[i].blockExplorerUrls;
      return blockExplorerUrls + '/tx/' + transaction;
    }
  }

  return transaction;
}

//click to like nft
const onLikeNft = async (tokenId:number) => {

  try{
    const tx = await web3nft.likeNft(tokenId);
    connectState.transactions.value.push(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Like success! Transaction: </span><a href="' + 
      transactionExplorerUrl(tx) + 
      '" target="_blank">' + tx + '</a></div>';

    element.elMessage('success', msg, true);

    handleClick(); 

  }catch(e){
    if(e.stack.length > 300){
      e.stack = e.stack.slice(0, 300);
    }
    element.elMessage('error', e.stack);
  }
 
}

//click to hate nft
const onHateNft = async (tokenId:number) => {

  try{

    const tx = await web3nft.hateNft(tokenId);
    connectState.transactions.value.push(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Hate success! Transaction: </span><a href="' + 
      transactionExplorerUrl(tx) + 
      '" target="_blank">' + tx + '</a></div>';

    element.elMessage('success', msg, true);    

    handleClick();      

  }catch(e){
    if(e.stack.length > 300){
      e.stack = e.stack.slice(0, 300);
    }
    element.elMessage('error', e.stack);
  }

}

//click to burn nft
const onBurnNft = async (tokenId:number) => {
  try{

    const tx = await web3nft.burn(tokenId);
    connectState.transactions.value.push(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Burn success! Transaction: </span><a href="' + 
      transactionExplorerUrl(tx) + 
      '" target="_blank">' + tx + '</a></div>';

    element.elMessage('success', msg, true);    

    handleClick();

  }catch(e){
    if(e.stack.length > 300){
      e.stack = e.stack.slice(0, 300);
    }
    element.elMessage('error', e.stack);
  }

}

//click to claim rewards
const onClaimRewards = async () => {
  try{

    const rewards = await web3nft.getAddressRewards();
  
    if(rewards > 0){
      const tx = await web3nft.claim();
      connectState.transactions.value.push(tx);
      connectState.transactionCount.value++;   

      const msg = '<div><span>Claim success! Transaction: </span><a href="' + 
        transactionExplorerUrl(tx) + 
        '" target="_blank">' + tx + '</a></div>';

      element.elMessage('success', msg, true);         

      handleClick();  
    } else {
      element.elMessage("warning", "You have no rewards to claim now!");
    }

  }catch(e){
    if(e.stack.length > 300){
      e.stack = e.stack.slice(0, 300);
    }
    element.elMessage('error', e.stack);
  }

}

//click to reward nft
const onRewardNft = async (tokenId:number) => {
  const opts = {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    inputType: 'number',
    inputValue: '0.01',
    inputErrorMessage: 'Invalid number',
  };

  element.elMessageBox('Please enter the amount to reward the NFT', 'Reward', opts, async (value:number) => {

      try{
        const tx = await web3nft.rewardNft(tokenId, value);
        connectState.transactions.value.push(tx);
        connectState.transactionCount.value++;

        const msg = '<div><span>Reward success! Transaction: </span><a href="' + 
          transactionExplorerUrl(tx) + 
          '" target="_blank">' + tx + '</a></div>';

        element.elMessage('success', msg, true);        

        handleClick();

      }catch(e){
        if(e.stack.length > 300){
          e.stack = e.stack.slice(0, 300);
        }
        element.elMessage('error', e.stack);
      }

    });
}

//get nft count and pull nft info
const getNftCount = async (nfttype:string) => {
  const newNftList = new Array();

  if(nfttype === 'all'){
    const total = await web3nft.totalSupply();

    for(let i = 0; i < total.toNumber(); i++){
      const tokenId = (await web3nft.tokenByIndex(i)).toNumber();
      const tokenType = await web3nft.tokenType(tokenId);
      if(connectState.search === '' ||
        tokenType.indexOf(connectState.search) != -1 ||
        tokenType.search(connectState.search) != -1 ||
        (String(tokenId)).indexOf(connectState.search) != -1 ||
        (String(tokenId)).search(connectState.search) != -1){

        const tokenUri = await web3nft.tokenURI(tokenId);
        const hates = (await web3nft.getHates(tokenId)).toNumber();
        const likes = (await web3nft.getLikes(tokenId)).toNumber();
        const rewards = await web3nft.getTokenRewards(tokenId);

        newNftList.push([tokenId, tokenType, tokenUri, likes, hates, Number(utils.formatEther(rewards))]);
      }
    }
  }else{
    const total = await web3nft.balanceOf(connectState.userAddr.value);
    
    for(let i = 0; i < total.toNumber(); i++){
      const tokenId = (await web3nft.tokenOfOwnerByIndex(connectState.userAddr.value, i)).toNumber();
      const tokenType = await web3nft.tokenType(tokenId);
      if(connectState.search === '' ||
        tokenType.indexOf(connectState.search) != -1 ||
        tokenType.search(connectState.search) != -1 ||
        (String(tokenId)).indexOf(connectState.search) != -1 ||
        (String(tokenId)).search(connectState.search) != -1){

        const tokenUri = await web3nft.tokenURI(tokenId);
        const hates = (await web3nft.getHates(tokenId)).toNumber();
        const likes = (await web3nft.getLikes(tokenId)).toNumber();
        const rewards = await web3nft.getTokenRewards(tokenId);

        newNftList.push([tokenId, tokenType, tokenUri, likes, hates, Number(utils.formatEther(rewards))]);
      }
    }    
  }

  nftTotal.value = newNftList.length;
  nftList.value = newNftList;
}

//click to change active item and refresh page
const handleClick = async () => {

  connectState.activeName.value = activeName.value;
  tools.setUrlParamter('activeName', activeName.value);

  try{

    loadStatus.value = true;

    await getNftCount(activeName.value);

    if(currentPage.value < 1){
      currentPage.value = 1;
    }

    let totalPage = Math.floor(nftTotal.value/pageSize.value);

    if((nftTotal.value%pageSize.value)!=0){
      totalPage += 1;
    }

    console.log(totalPage);
    console.log(currentPage.value);

    if(currentPage.value > totalPage){
      currentPage.value = totalPage;
    }

    let start = (currentPage.value-1) * pageSize.value;
    let end = currentPage.value * pageSize.value;

    if(start < 0){
      start = 0;
    }

    if(end > nftTotal.value){
      end = nftTotal.value;
    }

    nftList.value = nftList.value.slice(start, end);

    const rewards = await web3nft.getAddressRewards();

    userRewards.value = Number(utils.formatEther(rewards)).toFixed(3);

  }catch(e){
    if(e.stack.length > 300){
      e.stack = e.stack.slice(0, 300);
    }    
    element.elMessage('error', e.stack);
  }finally{
    loadStatus.value = false;
  }

}

//clean search content and bind search callback function
connectState.search = '';
connectState.searchCallback = handleClick;

//try get activeName from the url paramter
try{
  activeName.value = tools.getUrlParamter('activeName');

  if(activeName.value != 'all' && activeName.value != 'mine'){

    activeName.value = 'all';
  }
}catch(e){
  activeName.value = 'all';
}

//set activeIndex to connectState and location.href
connectState.activeName.value = activeName.value;
tools.setUrlParamter('activeName', activeName.value);

//update page size
if (connected()){
  handleClick();
}
</script>