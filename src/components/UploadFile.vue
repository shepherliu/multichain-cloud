<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Upload</span>
      </div>
    </template>
    <el-empty  v-if="selectedFile ===''" description="no data" />
    <el-table v-if="selectedFile !=''" :data="fileDescription" style="width: 250px;text-align: left;">
      <el-table-column prop="description" label="Description" width="100px" />
      <el-table-column prop="value" label="Value" width="100px" />
    </el-table>    
    <el-upload
      drag
      multiple
      class="upload-folder"
      ref="upload"
      action=""
      @change="onChangeSelectFiles"
      @click="onSelectFiles"
      @drop="scanFiles"
      :accept="acceptType"
      :limit="limits"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop to here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          <!-- jpg/png files with a size less than 500kb -->
        </div>
      </template>
    </el-upload>
    <el-switch
      v-model="isFolder"
      size="small"
      @change="onChangeUploadType"
      active-text="Folder"
    />
    <el-button @click="onUploadFile" type="primary" round style="margin-left: 15px;">
      Upload<el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>      
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'UploadFile',
  props: {
  },  
}
</script>

<script setup lang="ts">  
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue'
import { toRaw } from '@vue/reactivity'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadFile, UploadFiles } from 'element-plus'

import * as path from "path"

import * as utils from '../libs/utils'
import * as storage from '../libs/storage'
import * as element from "../libs/element"

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const upload = ref<UploadInstance>();
const isFolder = ref(false);
const limits = ref(1);
const acceptType = ref('');
const selectedFile = ref('');
const fileList = ref(new Array());
const fileDescription = ref(new Array());

(window as any).ondragover = (e:any) => {
  e.preventDefault();
}

//scan directory when drag
const scanFiles = async (e:any) => {
  e.preventDefault();
  const { items = [], files = [] } = e.dataTransfer;

  const [item] = items;
  if (!item || !item.webkitGetAsEntry) return files;
  
  const entry = item.webkitGetAsEntry();

  if(entry.isFile){
    isFolder.value = false;
    onChangeUploadType();

    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
  }else{
    isFolder.value = true;
    onChangeUploadType();
    
    getEntryDirectoryFiles(entry, '');  
  }
}

const getEntryDirectoryFiles = async (entry:any, name:string) => {
  const reader = entry.createReader();

  if(name===''){
    name = entry.name;
  }else{
    name = name + path.sep + entry.name;
  }
  
  reader.readEntries(async (entries:any) => {
    entries.map(async (entry:any) => {
      if (entry.isFile){
        entry.file(async (file:any) => {
          //fix webkitRelativePath
          const rawFile = {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: name,
            uid: genFileId(),
            text: file.text,
            stream: file.stream,
            slice: file.slice,
            arrayBuffer: file.arrayBuffer,
          };
  
          upload.value!.handleStart(rawFile as UploadRawFile);
        });
      }else{
        getEntryDirectoryFiles(entry, name);
      }
    });
  });
}    

const onChangeUploadType = async () => {
  if(isFolder.value){
    limits.value = 0;
    acceptType.value = '';
  }else{
    limits.value = 1;
  }

  selectedFile.value = '';
  upload.value!.clearFiles();

  const currentClass = (proxy as any).$el.parentNode.querySelector(".upload-folder");

  (currentClass.querySelector(".el-upload__input") as any).webkitdirectory = isFolder.value;
  (currentClass.querySelector(".el-upload__input") as any).multiple = isFolder.value;
}

const handleExceed: UploadProps['onExceed'] = (files:any) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const onSelectFiles = async () => {
  upload.value!.clearFiles();
}

const onUploadFile = async () => {
  if(toRaw(fileList.value).length === 0){
    element.elMessage('warning', 'You have not select any file or folder to upload!');
    return;
  }

  if(!isFolder.value){
    await storage.uploadFile(toRaw(fileList.value)[0]);
  } else {
    await storage.uploadFolder(fileDescription.value[0].value, toRaw(fileList.value));
  }
}

const onChangeSelectFiles = async (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  const files = toRaw(uploadFiles);
  fileList.value = files;

  if(isFolder.value){
    selectedFile.value = (files[0].raw as any).webkitRelativePath.split(path.sep)[0];
    if(selectedFile.value === ''){
      selectedFile.value = (files[0].raw as any).name;
    }
  }else{
    selectedFile.value = (files[0].raw as any).name;
  }

  let fileSize = 0;
  let fileType = 'folder';

  for (const i in files) {
    fileSize += (files[i].raw as any).size;
    if(!isFolder.value){
      fileType = utils.fileType((files[0].raw as any).name);
      break;
    }

    if((files[i].raw as any).name === 'index.html'){
      const relPath = (files[i].raw as any).webkitRelativePath;
      if(relPath.split(path.sep).length <= 2){
        fileType = 'website';
      }
    }
  }

  fileDescription.value = [
    { description: 'Name', value: selectedFile.value,},
    { description: 'Type', value: fileType,},
    { description: 'Size', value: utils.fileSize(fileSize),},
    { description: 'Cost', value: 0,},         
  ];
}
</script>
