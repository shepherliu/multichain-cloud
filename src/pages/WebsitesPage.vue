<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="Website" name="website"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="height: 450px;">
        <el-row :gutter="20">
          <template v-for="file in fileList" :key="file[2]">
              <el-col :span="8">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <el-popover placement="bottom-start" :width="300" :title="file[0]">
                        <template #reference>
                          <span><a target="_blank" :href="file[2]">{{file[0]}}</a></span>
                        </template>
                        <embed v-if="file[1]==='website'" type="text/html" :src="file[2]" style="height:100%;width: 100%;" />
                      </el-popover>
                      <span>{{file[3]}}</span>
                    </div>
                  </template>
                  <el-button-group>
                    <el-button type="danger" @click="onDeleteFile(file[2])">
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
            v-model="currentPage"
            :total="fileTotal"
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
  name: 'WebsitesPage',
  props: {
  }
}
</script>

<script setup lang="ts">
import { ref } from "vue"

import { useStore } from 'vuex'

import * as filemanager from "../libs/filemanager"
import * as utils from "../libs/utils"

const store = useStore();

const activeName = ref("website");

const pageSize = ref(9);
const currentPage = ref(0);

const fileTotal = ref(0);

const fileList = ref(new Array());

const getFileCount = async (filetype:string) => {
  const res = await filemanager.getIndexsByFileType(filetype);

  const newFileList = new Array();

  for(const i in res){
    const index = res[i].toNumber();
    const fileInfo = await filemanager.getFileInfoByIndex(index);
    
    if(store.state.search === ''){
      newFileList.push(fileInfo.slice(0,));
      continue;
    }

    const name = fileInfo[0];
    if(name.indexOf(store.state.search)!=-1 || name.search(store.state.search)!=-1){
      newFileList.push(fileInfo.slice(0,));
      continue
    }
  }

  fileList.value = newFileList;
  for(const i in fileList.value){
    fileList.value[i][3] = utils.fileSize(fileList.value[i][3].toNumber());
  }

  fileTotal.value = fileList.value.length;
}

const handleClick = async () => {
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
}

const onDeleteFile = async (fileid:string) => {
  await filemanager.delFile(fileid);

  handleClick();
}

handleClick();
</script>