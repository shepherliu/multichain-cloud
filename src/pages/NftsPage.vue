<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="AllNfts" name="all"></el-tab-pane>
          <el-tab-pane label="MyNfts" name="mine"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="height: 450px;">
        <el-row :gutter="20">
          <template v-for="nft in nftList" :key="nft[2]">
              <el-col :span="8">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>TokenId: <a target="_blank" :href="tokenExplorerUrl(nft[0], nft[2])">{{nft[0]}}</a></span>
                      <el-button v-if="activeName==='mine'" type="danger" @click="onBurnNft(nft[0])">
                        Burn<el-icon><delete /></el-icon>
                      </el-button>
                    </div>
                  </template>
                  <img v-if="nft[1]==='image'" :src="nft[2]" style="width: 200px;height: 200px;" />
                  <audio v-if="nft[1]==='audio'" :src="nft[2]" controls preload style="width: 200px;height: 200px;" />
                  <video v-if="nft[1]==='video'" :src="nft[2]" controls preload style="width: 200px;height: 200px;" />
                  <div>
                    <el-link type="primary" @click="onLikeNft(nft[0])">Like : {{nft[3]}}</el-link>
                    <el-link type="warning" @click="onHateNft(nft[0])">Hate : {{nft[4]}}</el-link>
                    <el-link type="success" @click="onRewardNft(nft[0])">Reward : {{nft[5]}}</el-link>
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
            v-model="currentPage"
            :total="nftTotal"
            :page-size="pageSize"
            style="float: right;"
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

import { useStore } from 'vuex'

import * as web3nft from "../libs/web3nft"
import { connectState } from "../libs/connect"

import * as constant from "../constant"

const store = useStore();

const activeName = ref("all");

const pageSize = ref(6);
const currentPage = ref(0);

const nftTotal = ref(0);

const nftList = ref(new Array());  

const getNftCount = async (nfttype:string) => {
  const newNftList = new Array();

  if(nfttype === 'all'){
    const total = await web3nft.totalSupply();

    for(let i = 0; i < total.toNumber(); i++){
      const tokenId = await web3nft.tokenByIndex(i);
      const tokenType = await web3nft.tokenType(tokenId);
      if(store.state.search === '' ||
        tokenType.indexOf(store.state.search) != -1 ||
        tokenType.search(store.state.search) != -1) {

        const tokenUri = await web3nft.tokenURI(tokenId);
        const hates = await web3nft.getHates(tokenId);
        const likes = await web3nft.getLikes(tokenId);
        const rewards = await web3nft.getTokenRewards(tokenId);

        newNftList.push([tokenId, tokenType, tokenUri, hates.toNumber(), likes.toNumber(), rewards.toNumber()]);
      }
    }
  }else{
    const total = await web3nft.balanceOf(connectState.userAddr);
    
    for(let i = 0; i < total.toNumber(); i++){
      const tokenId = await web3nft.tokenOfOwnerByIndex(connectState.userAddr, i);
      const tokenType = await web3nft.tokenType(tokenId);
      if(store.state.search === '' ||
        tokenType.indexOf(store.state.search) != -1 ||
        tokenType.search(store.state.search) != -1) {

        const tokenUri = await web3nft.tokenURI(tokenId);
        const hates = await web3nft.getHates(tokenId);
        const likes = await web3nft.getLikes(tokenId);
        const rewards = await web3nft.getTokenRewards(tokenId);

        newNftList.push([tokenId, tokenType, tokenUri, likes.toNumber(), hates.toNumber(), rewards.toNumber()]);
      }
    }    
  }

  console.log(newNftList);

  nftTotal.value = newNftList.length;
  nftList.value = newNftList;
}

const handleClick = async () => {
  await getNftCount(activeName.value);

  if(currentPage.value < 1){
    currentPage.value = 1;
  }

  let totalPage = Math.floor(nftTotal.value/pageSize.value);

  if((nftTotal.value%pageSize.value)!=0){
    totalPage += 1;
  }

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
}

const onBurnNft = async (tokenId:number) => {
  await web3nft.burn(tokenId);

  handleClick();
}

const onLikeNft = async (tokenId:number) => {
  await web3nft.likeNft(tokenId);

  handleClick();  
}

const onHateNft = async (tokenId:number) => {
  await web3nft.hateNft(tokenId);

  handleClick();  
}

const onRewardNft = async(tokenId:number) => {

}

const tokenExplorerUrl = (tokenId:number, tokenURI:string) => {
  for(const i in constant.chainList){
    if(connectState.chainId === constant.chainList[i].chainId){
      const blockExplorerUrls = constant.chainList[i].blockExplorerUrls;
      return blockExplorerUrls + '/token/' + constant.nftContractAddress + '?a=' + tokenId + '#inventory';
    }
  }

  return tokenURI;
}

handleClick(); 
</script>