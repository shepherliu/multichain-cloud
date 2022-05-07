<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="Image" name="image"></el-tab-pane>
          <el-tab-pane label="Audio" name="audio"></el-tab-pane>
          <el-tab-pane label="Video" name="video"></el-tab-pane>
          <el-tab-pane label="Docs" name="docs"></el-tab-pane>
        </el-tabs>
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
          <template v-for="file in fileList" :key="file[2]">
              <el-col :span="8">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <el-popover placement="bottom-start" :width="600" :title="file[0]">
                        <template #reference>
                          <span><a target="_blank" :href="file[2]">{{file[0]}}</a></span>
                        </template>
                        <img v-if="file[1]==='image'" :src="file[2]" style="width: 400px;" />
                        <audio v-if="file[1]==='audio'" :src="file[2]" controls preload style="width: 400px;" />
                        <video v-if="file[1]==='video'" :src="file[2]" controls preload style="width: 600px;" />
                        <embed v-if="file[1]==='docs'" type="text/html" :src="file[2]" style="height:600px;width: 600px;" />
                      </el-popover>
                      <span>{{file[3]}}</span>
                    </div>
                  </template>
                  <el-button-group>
                    <el-button 
                      type="primary"
                      v-if="file[1]==='image'||file[1]=='audio'||file[1]=='video'"
                      :disabled="file[4]"
                      size="small"
                      @click="onMintNft(file[1], file[2])"
                    >
                      {{file[4] ? "Minted" : "MintNFT"}}<el-icon><share /></el-icon>
                    </el-button>
                    <el-button type="danger" size="small" @click="onDeleteFile(file[2])">
                      Delete<el-icon><delete /></el-icon>
                    </el-button>
                  </el-button-group>
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
            :total="fileTotal"
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
  name: 'FilesPage',
  props: {
  }
}
</script>

<script setup lang="ts">
import { ref } from "vue"

import * as filemanager from "../libs/filemanager"
import * as web3nft from "../libs/web3nft"
import * as tools from "../libs/tools"
import { connected, connectState } from "../libs/connect"
import * as element from "../libs/element"
import * as constant from "../constant"

const activeName = ref("image");
const loadStatus = ref(false);
const pageSize = ref(6);
const currentPage = ref(0);
const fileTotal = ref(0);
const fileList = ref(new Array());

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

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

//click to delete file
const onDeleteFile = async (fileid:string) => {

  try{

    const tx = await filemanager.delFile(fileid);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Delete success! Transaction: </span><a href="' + 
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

// click to mint nft
const onMintNft = async (filetype:string, fileid:string) => {

  try{

    const tx = await web3nft.mint(filetype, fileid);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Mint success! Transaction: </span><a href="' + 
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

//get total file count and pull files info
const getFileCount = async (filetype:string) => {
  const res = await filemanager.getIndexsByFileType(filetype);

  const newFileList = new Array();

  for(const i in res){
    const index = res[i].toNumber();
    const fileInfo = await filemanager.getFileInfoByIndex(index);
    const name = fileInfo[0];
    
    if(connectState.search === '' ||
      name.indexOf(connectState.search) != -1 ||
      name.search(connectState.search) != -1) {

      newFileList.push(fileInfo.slice(0,));
    }
  }

  fileList.value = newFileList;
  for(const i in fileList.value){
    fileList.value[i][3] = tools.fileSize(fileList.value[i][3].toNumber());
    fileList.value[i].push(await web3nft.minted(fileList.value[i][2]));
  }

  fileTotal.value = fileList.value.length;
}

//click to change active item and refresh page
const handleClick = async () => {

  connectState.activeName.value = activeName.value;
  tools.setUrlParamter('activeName', activeName.value);

  try{

    loadStatus.value = true;
    
    await getFileCount(activeName.value);

    if(currentPage.value < 1){
      currentPage.value = 1;
    }

    let totalPage = Math.floor(fileTotal.value/pageSize.value);

    if((fileTotal.value%pageSize.value)!=0){
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

    if(end > fileTotal.value){
      end = fileTotal.value;
    }

    fileList.value = fileList.value.slice(start, end);

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

  if(activeName.value != 'image' && 
    activeName.value != 'audio' && 
    activeName.value != 'video' && 
    activeName.value != 'docs'){

    activeName.value = 'image';
  }
}catch(e){
  activeName.value = 'image';
}

//update page
if (connected()){
  handleClick();
}
</script>