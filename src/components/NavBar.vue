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
        ellipsis="false"
        unique-opened="true"
        background-color="#606266"
        style="float: left;width: 100%;"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">Medias</el-menu-item>
        <el-menu-item index="2">Docs</el-menu-item>
        <el-menu-item index="3">Folders</el-menu-item>
        <el-menu-item index="4">Websites</el-menu-item>
        <el-menu-item index="5">Nfts</el-menu-item>
      </el-menu>
    </el-col>

    <!-- search component -->
    <el-col :span="3">
      <el-input size="large" v-model="searchContent" placeholder="Search" style="margin-top: 10px;">
      </el-input>
    </el-col>
    
    <el-col :span="1">
      <el-button circle color="#606266" size="large" style="margin-top: 10px;">
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
  <el-drawer v-model="showSwitchNetwork" direction="rtl" destroy-on-close>
      <template #title>
        <h4>Select to swith the network</h4>   
      </template>
      <template #default>
        <div>
          <el-select v-model="networkSelected" placeholder="Select Network" :popper-append-to-body="false" filterable clearable>
            <el-option
              v-for="item in networkOptions"
              :key="item.chainName"
              :label="item.chainName"
              :value="item.chainId"
            />
          </el-select> 
        </div>
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
import { ref } from "vue"

import * as utils from "../libs/utils"
import * as connect from "../libs/connect"
import * as network from "../libs/network"
import * as element from "../libs/element"

import * as constant from "../constant"

export default {
  name: 'NavBar',
  props: {
  },
  setup() {
    const logo = require('@/assets/logo.png');
    const metamask = require('@/assets/metamask.svg');
    const userAddr = ref("");
    const networkName = ref("");
    const shortAddr = ref("");
    const searchContent = ref("");
    const activeIndex = ref("1");
    const connectStatus = ref("Connect Wallet");
    const showSwitchNetwork = ref(false);
    const networkSelected = ref('');
    const networkOptions = constant.chainList;

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
      console.log(key, keyPath);
    };    

    //on click to copy address
    const onClickToCopy = async () => {
      utils.clickToCopy(userAddr.value);
      
      element.elMessage('success', 'Copy address to clipboard success.');     
    };

    //on cancel switch network clicked
    const cancelSwitchNetwork = async () => {
      showSwitchNetwork.value = false;
      networkSelected.value = '';
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
      networkSelected.value = '';    
    }

    //on switch network clicked
    const onSwitchNetwork = async () => {
      networkSelected.value = '';
      showSwitchNetwork.value = true;
    }

    //on profile settings clicked
    const onProfileSettings = async () => {

    }

    return {
      logo,
      metamask,
      userAddr,
      networkName,
      shortAddr,
      searchContent,
      activeIndex,
      connectStatus,
      showSwitchNetwork,
      networkSelected,
      networkOptions,
      handleSelect,
      onConnect,
      onClickToCopy,
      onSwitchNetwork,
      onProfileSettings,
      cancelSwitchNetwork,
      confirmSwitchNetwork,
    };
  }
}
</script>
