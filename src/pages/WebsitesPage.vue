<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="Website" name="website"></el-tab-pane>
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
                        <embed v-if="file[1]==='website'" type="text/html" :src="file[2]" style="height:600px;width: 600px;" />
                      </el-popover>
                      <span>{{file[3]}}</span>
                    </div>
                  </template>
                  <el-button-group>
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
  name: 'WebsitesPage',
  props: {
  }
}
</script>

<script setup lang="ts">
import { ref } from "vue"

import { connected, connectState } from "../libs/connect"
import * as filemanager from "../libs/filemanager"
import * as tools from "../libs/tools"
import * as element from "../libs/element"
import * as constant from "../constant"

const activeName = ref("website");
const loadStatus = ref(false);
const pageSize = ref(6);
const currentPage = ref(0);
const fileTotal = ref(0);
const fileList = ref(new Array());

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
    connectState.transactions.value.push(tx);
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

//get total file count and pull files info
const getFileCount = async (filetype:string) => {
  const res = await filemanager.getIndexsByFileType(filetype);

  const newFileList = new Array();

  for(const i in res){
    const index = res[i].toNumber();
    const fileInfo = await filemanager.getFileInfoByIndex(index);
    
    if(connectState.search === ''){
      newFileList.push(fileInfo.slice(0,));
      continue;
    }

    const name = fileInfo[0];
    if(name.indexOf(connectState.search)!=-1 || name.search(connectState.search)!=-1){
      newFileList.push(fileInfo.slice(0,));
      continue
    }
  }

  fileList.value = newFileList;
  for(const i in fileList.value){
    fileList.value[i][3] = tools.fileSize(fileList.value[i][3].toNumber());
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

  if(activeName.value != 'website'){

    activeName.value = 'website';
  }
}catch(e){
  activeName.value = 'website';
}

//set activeIndex to connectState and location.href
connectState.activeName.value = activeName.value;
tools.setUrlParamter('activeName', activeName.value);

//update page size
if (connected()){
  handleClick();
}
</script>