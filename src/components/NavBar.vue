<template>
  <el-row>
    <!-- project logo -->
    <el-col :span="2">
      <div style="float: right;">
        <el-image style="width: 35px;height: 33px; float: right;margin-right: 10px;margin-top: 10px;" :src="logo"/>
      </div>        
    </el-col> 

    <!-- project menus -->
    <el-col :span="10">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        :unique-opened="true"
        background-color="#606266"
        style="float: left;width: 100%;"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">Files</el-menu-item>
        <el-menu-item index="2">Folders</el-menu-item>
        <el-menu-item index="3">Websites</el-menu-item>
        <el-menu-item index="4">Nfts</el-menu-item>
      </el-menu>
    </el-col>

    <!-- search component -->
    <el-col :span="3">
      <el-input size="large" v-model="searchContent" placeholder="Search" style="margin-top: 10px;">
      </el-input>
    </el-col>
    
    <el-col :span="1">
      <el-button circle color="#606266" size="large" style="margin-top: 10px;" @click="onSearchContent">
        <el-icon :size="20"><search /></el-icon>
      </el-button>
    </el-col>  
    
    <!-- notify component -->
    <el-col :span="4">
      <el-button circle color="#606266" size="large" style="margin-top: 10px;float: right;">
        <el-icon :size="20"><bell /></el-icon>
      </el-button>
    </el-col>       
    
    <!-- user addr -->
    <el-col :span="3">
      <el-popover
        placement="bottom-start"
        :title="networkName"
        :width="200"
        trigger="hover"
        :content="userAddr"
      >
        <template #reference>
          <a @click="onClickToCopy" style="margin-top: 17px;padding-right: 10px;float: right;">{{shortAddr}}</a>
        </template>
      </el-popover>      
    </el-col>

    <!-- connect component -->
    <el-col :span="1">
      <div style="float: right;">
          <el-dropdown button trigger="click" style="width: 35px;height: 33px; float: right;margin-right: 20px;margin-top: 10px;">
            <el-image :src="metamask" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="onConnect" :innerText="connectStatus"></el-dropdown-item>
                <el-dropdown-item @click="onSwitchNetwork">Switch Network</el-dropdown-item>
                <el-dropdown-item @click="onProfileSettings">Profile Settings</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
      </div>  
    </el-col>

  </el-row>
  
  <!-- side drawer component-->
  <el-drawer v-model="showSwitchNetwork" direction="rtl" destroy-on-close @open="onDrawerOpen">
      <template #title>
        <h4>Select to swith the network</h4>   
      </template>
      <template #default>
        <table style="margin-left: 50px;">
          <tr>
            <td style="width:100px">Network</td>
            <td style="width:200px">
              <el-select 
                v-model="networkSelected"
                style="width:200px" 
                placeholder="Select Network" 
                :teleported="false"
                @change="onNetworkSelected"
                filterable
              >
                <el-option
                  v-for="item in networkOptions"
                  :key="item.chainName"
                  :label="item.chainName"
                  :value="item.chainId"
                />
              </el-select>
            </td>
          </tr>
          <tr>
            <td style="width:100px">Storage</td>
            <td style="width:200px">
              <el-select 
                v-model="storageSelected"
                style="width:200px"
                placeholder="Select Storage"
                :teleported="false"
                filterable
              >
                <el-option key="swarm" label="Swarm Network" value="swarm"/>
                <el-option key="bundlr" label="Bundlr Network" value="bundlr"/>
                <el-option key="filcoin" label="Filcoin Network" value="filcoin"/>
              </el-select> 
            </td>
          </tr>
          <tr v-if="storageSelected==='bundlr'">
            <td style="width:100px">Token</td>
            <td style="width:200px">
              <el-select
                v-model="tokenSelected"
                style="width:200px"
                placeholder="Select Network"
                :teleported="false"
                filterable
              >
                <el-option
                  v-for="item in tokenOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>               
            </td>
          </tr>
          <tr v-if="storageSelected==='filcoin'">
            <td style="width:100px">ApiToken</td>
            <td style="width:200px;">
              <el-input
                v-model="apiTokenSelected"
                style="width:200px;margin-left: 10px;"
                clearable
              >
              </el-input>
            </td>
          </tr>
        </table>         
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelSwitchNetwork">cancel</el-button>
          <el-button type="primary" @click="confirmSwitchNetwork">confirm</el-button>
        </div>
      </template>
    </el-drawer>  
</template>

<script lang="ts">  
export default {
  name: 'NavBar',
  props: {
  },
}
</script>

<script setup lang="ts">
import { ref } from "vue"
import { useStore } from 'vuex'

import * as utils from "../libs/utils"
import * as connect from "../libs/connect"
import * as network from "../libs/network"
import * as element from "../libs/element"

import * as constant from "../constant"

const store = useStore();
const logo = require('@/assets/logo.png');
const metamask = require('@/assets/metamask.svg');
const userAddr = ref("");
const networkName = ref("");
const shortAddr = ref("");
const searchContent = ref("");
const activeIndex = ref("1");
const connectStatus = ref("Connect Wallet");
const showSwitchNetwork = ref(false);
const networkSelected = ref(connect.connectState.chainId);
const storageSelected = ref(connect.connectState.storage);
const tokenSelected = ref(connect.connectState.currency);
const apiTokenSelected = ref(connect.connectState.web3Storage==='' ? constant.web3StorageAppKey : connect.connectState.web3Storage);
const networkOptions = constant.chainList;
const tokenOptions = ref((constant.tokenList as any)[connect.connectState.chainId]);

//on drawer open
const onDrawerOpen = async () => {
  networkSelected.value = connect.connectState.chainId;
  storageSelected.value = connect.connectState.storage;
  tokenSelected.value = connect.connectState.currency;
  tokenOptions.value = (constant.tokenList as any)[connect.connectState.chainId];

  //make sure token is avaiable in selected network
  for(const i in tokenOptions.value){
    if(tokenOptions.value[i] === tokenSelected.value){
      return;
    }
  }
  tokenSelected.value = tokenOptions.value[0];      
}

//connect to metamask
const connectNetwork = async () => {
  const res = await connect.networkConnect();
  if(res){
    userAddr.value = connect.connectState.userAddr;
    networkName.value = network.getChainName(connect.connectState.chainId);
    shortAddr.value = utils.shortString(userAddr.value);
    connectStatus.value = "Cancel Connect";

    element.elMessage('success', 'You have connected to the wallet.');

  } else{
    userAddr.value = "";
    shortAddr.value = "";
    networkName.value = "";
    connectStatus.value = "Connect Wallet";

    element.elMessage('error', 'Connect to the wallet failed.');              
  }
}

//disconnect from metamask
const disConnectNetwork = async () => {
    await connect.cancelConnect();

    connectStatus.value = "Connect Wallet";
    userAddr.value = "";
    shortAddr.value = "";
    networkName.value = "";

    element.elMessage('warning', 'You have disconnected to the wallet.');                     
}

//on wallet address changed
const accountsChanged = async () => {
  if(!connect.connected()){
    return await disConnectNetwork();
  }

  if(connectStatus.value === "Cancel Connect"){
    return await connectNetwork();
  }
}

connect.accountsChanged(accountsChanged);

//on wallet network changed
const networkChanged = async () => {
  if(!connect.connected()){
    return await disConnectNetwork();
  }

  if(connectStatus.value === "Cancel Connect"){
    return await connectNetwork();
  } 
}

connect.networkChanged(networkChanged); 

//on connect clicked
const onConnect = async () => {
  if(connectStatus.value === "Cancel Connect"){      
    return await disConnectNetwork();
  } else {
    return await connectNetwork();
  }
};

//on menus selected
const handleSelect = (key: string, keyPath: string[]) => {
  activeIndex.value = key;
  store.state.activeIndex = Number(activeIndex.value);
};    

//on click to copy address
const onClickToCopy = async () => {
  utils.clickToCopy(userAddr.value);
  
  element.elMessage('success', 'Copy address to clipboard success.');     
};

//on select the network
const onNetworkSelected = async () => {
  tokenOptions.value = (constant.tokenList as any)[networkSelected.value];
  for(const i in tokenOptions.value){
    if(tokenOptions.value[i] === tokenSelected.value){
      return;
    }
  }

  tokenSelected.value = tokenOptions.value[0];
}

//on cancel switch network clicked
const cancelSwitchNetwork = async () => {
  showSwitchNetwork.value = false;
}

//on confirm swithc network clicked
const confirmSwitchNetwork = async () => {
  showSwitchNetwork.value = false;
  if(Number(networkSelected.value) > 0){
    const res = await network.switchNetwork(Number(networkSelected.value));
    if(res && !connect.connected()){
      await connectNetwork();
    }
  }
  connect.connectState.storage = storageSelected.value;

  if (storageSelected.value === 'bundlr'){
    connect.connectState.currency = tokenSelected.value;
  }

  if (storageSelected.value === 'filcoin'){
    if (apiTokenSelected.value === ''){
      apiTokenSelected.value = constant.web3StorageAppKey;
    }

    connect.connectState.web3Storage = apiTokenSelected.value;
  }
}

//on switch network clicked
const onSwitchNetwork = async () => {
  showSwitchNetwork.value = true;
}

//on profile settings clicked
const onProfileSettings = async () => {

}

//on content search
const onSearchContent = async () => {
  store.state.search = searchContent.value.trim();
}
</script>
