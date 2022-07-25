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
          <template v-for="file in fileList" :key="file.fileIndex">
              <el-col :span="8">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span><el-link type="success" target="_blank" :href="file.fileId">{{file.fileName}}</el-link></span>
                      <span>{{file.fileSize}}</span>
                      <span 
                        style="float: right;"
                        v-loading="file.downloadStatus"
                        element-loading-text="Loading..."
                        :element-loading-spinner="svg"
                        element-loading-svg-view-box="-10, -10, 50, 50"
                        element-loading-background="#ffffff"
                      >
                        <el-button type="success" size="small" @click="onDownloadFile(file)">
                          <el-icon><Download /></el-icon>
                        </el-button>
                      </span>
                    </div>
                  </template>
                  <img v-if="file.fileType===0" :src="(file.isDecrypt||!file.isEncrypt)?file.fileDecrypt:empty" style="height:150px;width: 200px;" />
                  <audio v-if="file.fileType===1" :src="file.fileDecrypt" controls preload style="height:50px;width: 200px;" />
                  <video v-if="file.fileType===2" :src="file.fileDecrypt" controls preload style="height:150px;width: 200px;" />
                  <iframe v-if="file.fileType===3" frameborder="0" sandbox="allow-scripts allow-same-origin allow-popups" :src="file.fileDecrypt" style="height:150px;width: 200px;" />
                  <el-button-group>
                    <el-button 
                      v-if="file.isEncrypt===true&&file.isDecrypt===false"
                      type="success" 
                      size="small"
                      v-loading="file.encryptStatus"
                      element-loading-text="Loading..."
                      :element-loading-spinner="svg"
                      element-loading-svg-view-box="-10, -10, 50, 50"
                      element-loading-background="#ffffff"
                      @click="onDecriptFile(file)"
                    >
                      Decrypt<el-icon><View /></el-icon>
                    </el-button>
                    <el-button 
                      type="primary"
                      v-if="file.fileType===0||file.fileType==1||file.fileType==2"
                      :disabled="file.nftMinted"
                      size="small"
                      style="margin-left: 5px;margin-right: 5px;"
                      @click="onMintNft(file)"
                    >
                      {{file.nftMinted ? "Minted" : "MintNFT"}}<el-icon><share /></el-icon>
                    </el-button>
                    <el-button type="danger" size="small" @click="onDeleteFile(file.fileIndex)">
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
import * as crypto from "../libs/crypto"

const empty = require('@/assets/empty.png');

const activeName = connectState.activeName;
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

//click to download file
const onDownloadFile = async (file:any) => {

  const a = document.createElement("a");

  try{
    file.downloadStatus = true;

    if(file.isEncrypt && !file.isDecrypt){
      await onDecriptFile(file);

      if(file.fileDecrypt === file.fileId){
        element.alertMessage("decrypt file failed!");
        file.downloadStatus = false;
        return;
      }

      a.href = file.fileDecrypt;
    }else{
      const res = await fetch(file.fileId, {
        "referrer": (window as any).location.href,
        "referrerPolicy": "no-referrer-when-downgrade",
        "method": "GET",
        "credentials": "omit",
        "redirect": "follow",
      });    

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      a.href = url;
    }
  }catch(e){
    element.alertMessage("download file failed!");
    file.downloadStatus = false;
    return;
  }finally{
    file.downloadStatus = false;
  }

  a.style.display = "none";
  a.download = file.fileName;

  document.body.appendChild(a);

  const event = document.createEvent("MouseEvents");
  event.initEvent("click", true, true);
  a.dispatchEvent(event);

  document.body.removeChild(a);
}

//click to decrypt file
const onDecriptFile = async (file:any) => {

  try{
    file.encryptStatus = true;

    let res = await fetch(file.fileId, {
      "referrer": (window as any).location.href,
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "credentials": "omit",
      "redirect": "follow",
    });  

    if (res.status >= 200 && res.status <= 299){
      res = await res.json();

      const passward = await crypto.decryptPasswordWithWallet(res);
      const content = await crypto.decryptDataWithCryptoJs(res?.encrypt_data, passward);
      const decrypt_file = tools.makeFileObject(file.fileName, content);

      file.fileDecrypt = URL.createObjectURL(decrypt_file.raw);
      file.filePassword = passward;
      file.isDecrypt = true;

    }else{
      element.alertMessage("fetch file content failed!");
    }
  }catch(e){
    element.alertMessage("fetch file content failed!");
  }finally{
    file.encryptStatus = false;
  }

}

//click to delete file
const onDeleteFile = async (fileIndex:number) => {

  try{

    const tx = await filemanager.delFile(fileIndex);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Delete success! Transaction: </span><a href="' + 
      transactionExplorerUrl(tx) + 
      '" target="_blank">' + tx + '</a></div>';

    element.elMessage('success', msg, true);

    handleClick();

  }catch(e){
    element.alertMessage(e);
  }

}

// click to mint nft
const onMintNft = async (file:any) => {

  try{

    if(file.isEncrypt === true && file.isDecrypt === false){
      await onDecriptFile(file);

      if(file.fileDecrypt === file.fileId){
        element.alertMessage("decrypt file failed!");
        return;
      }
    }

    const tx = await web3nft.mint(file.fileType, file.fileId, file.filePassword);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;

    const msg = '<div><span>Mint success! Transaction: </span><a href="' + 
      transactionExplorerUrl(tx) + 
      '" target="_blank">' + tx + '</a></div>';

    element.elMessage('success', msg, true);  

    handleClick();

  }catch(e){
    element.alertMessage(e);
  }

}

//get total file count and pull files info
const getFileCount = async (filetype:string) => {
  const res = await filemanager.getIndexsByFileType(filetype);

  const newFileList = new Array();

  for(let i = res.length -1; i >= 0; i--){
    const index = res[i].toNumber();
    const fileInfo = await filemanager.getFileInfoByIndex(index);
    const name = fileInfo[0];
    
    if(connectState.search === '' ||
      name.indexOf(connectState.search) != -1 ||
      name.search(connectState.search) != -1) {

      newFileList.push({
        fileIndex: index,
        fileName: fileInfo[0],
        fileId: fileInfo[1],
        fileDecrypt: fileInfo[1],
        fileType: fileInfo[2],
        fileSize: fileInfo[3],
        filePassword: '',
        isEncrypt: fileInfo[4],
        isDecrypt: false,
        nftMinted: false,
        encryptStatus: false,
        downloadStatus: false,
      });
    }
  }

  fileList.value = newFileList;
  for(const i in fileList.value){
    fileList.value[i].fileSize = tools.fileSize(fileList.value[i].fileSize.toNumber());
    fileList.value[i].nftMinted = (await web3nft.minted(fileList.value[i].fileId));
  }

  fileTotal.value = fileList.value.length;
}

//click to change active item and refresh page
const handleClick = async () => {
  //wait for the active name change
  await tools.sleep(100);  

  connectState.activeName.value = activeName.value;
  tools.setUrlParamter('activeName', activeName.value);

  try{

    loadStatus.value = true;

    if (!(await connected())){
      fileList.value = new Array();
      return;
    }    
    
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

  }catch(e){
     fileList.value = new Array();
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
handleClick();
</script>