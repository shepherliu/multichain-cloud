<template>
  <div class="file-arae">
    <el-container>
      <el-header style="background-color: #ffffff;">
        <el-tabs v-model="activeName" class="file-tabs" @tab-click="handleClick">
          <el-tab-pane label="All" name="all"></el-tab-pane>
          <el-tab-pane label="Mine" name="mine"></el-tab-pane>
        </el-tabs>     
        <el-button type="primary" size="small" style="float: right;margin-right: 50px;" @click="onAddWeb3Vote">NEW+
        </el-button>    
        <el-drawer v-model="showAddNewVoteVisiable" direction="rtl" destroy-on-close>
          <template #header>
            <h4>Create A New Vote.</h4>   
          </template>
          <template #default>  
            <table style="margin-left: 10px;">
              <tr v-if="voteId > 0">
                <td style="width:120px">Id
                  <el-popover
                    placement="top-start"
                    title="Vote Id"
                    :width="200"
                    trigger="hover"
                    content="The id of the web3 vote."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteId" disabled>
                    <template #append>
                      <el-icon @click="onClickToCopy(voteId)"><document-copy /></el-icon>
                    </template>
                  </el-input>
                </td>
              </tr>
              <tr>
                <td style="width:120px">Title
                  <el-popover
                    placement="top-start"
                    title="Vote Title"
                    :width="200"
                    trigger="hover"
                    content="The title of the web3 vote."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteTitle">
                    <template #append>
                      <el-icon @click="onClickToCopy(voteTitle)"><document-copy /></el-icon>
                    </template>
                  </el-input>
                </td>                   
              </tr>           
              <tr>
                <td style="width:120px">Description
                  <el-popover
                    placement="top-start"
                    title="Vote Description"
                    :width="200"
                    trigger="hover"
                    content="The description of the web3 vote."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteDescription" type="textarea" rows = "5">
                  </el-input>
                </td>                   
              </tr>  
              <tr>
                <td style="width:120px">Vote Type
                  <el-popover
                    placement="top-start"
                    title="Vote Type"
                    :width="200"
                    trigger="hover"
                    content="The vote type of the web3 vote."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px;margin-left:0px;">
                  <el-select 
                    v-model="voteType"
                    style="width:100%;margin-left:0px;"
                    placeholder="Select Vote Type"
                    :teleported="false"
                    :disabled="voteId > 0"
                    filterable
                  >
                    <el-option label="ApplyForNormalVote" key="ApplyForNormalVote" :value="0" />
                    <el-option label="ApplyForTreassure" key="ApplyForTreassure" :value="1" />
                    <el-option label="ChangeMaxTotalSupply" key="ChangeMaxTotalSupply" :value="2" />
                    <el-option label="ChangeMaxUserSupply" key="ChangeMaxUserSupply" :value="3" />
                    <el-option label="ChangeMaxUserHates" key="ChangeMaxUserHates" :value="4" />
                    <el-option label="ChangeMinUserAggrees" key="ChangeMinUserAggrees" :value="5" />
                    <el-option label="ChangeMaxUserVotes" key="ChangeMaxUserVotes" :value="6" />
                  </el-select> 
                </td>              
              </tr>
              <tr>
                <td style="width:120px">End Time
                  <el-popover
                    placement="top-start"
                    title="Vote End Time"
                    :width="200"
                    trigger="hover"
                    content="The end time of the web3 vote."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-date-picker
                    v-model="voteEndTime"
                    style="width: 100%;"
                    type="datetime"
                    placeholder="Pick a Date"
                    :format="timeFormat"
                  >
                  </el-date-picker>
                </td>                   
              </tr>  
              <tr>
                <td style="width:120px">Pay Token
                  <el-popover
                    placement="top-start"
                    title="Vote Payment Token"
                    :width="200"
                    trigger="hover"
                    content="The token contract for the web3 vote. You can choose the blockchain native token or the erc20 tokens based on the balance of the treassure."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteToken" :disabled="voteId > 0">
                    <template #append>
                      <el-icon @click="onClickToCopy(voteToken)"><document-copy /></el-icon>
                    </template>
                  </el-input>
                </td>                   
              </tr>  
              <tr>
                <td style="width:120px">Pay Value
                  <el-popover
                    placement="top-start"
                    title="Vote Pay Value"
                    :width="200"
                    trigger="hover"
                    content="The amount of the token value that the vote request for."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteValue" :disabled="voteId > 0">
                     <template #append>
                      <el-icon @click="onClickToCopy(voteValue)"><document-copy /></el-icon>
                    </template>
                  </el-input>
                </td>                   
              </tr>                                            
              <tr>
                <td style="width:120px">Pay To
                  <el-popover
                    placement="top-start"
                    title="Vote Pay To"
                    :width="200"
                    trigger="hover"
                    content="The dest address that the vote payment send to."
                  >
                    <template #reference>
                     <el-icon><QuestionFilled /></el-icon>
                    </template>
                </el-popover>
                </td>
                <td style="width:300px">
                  <el-input v-model="voteTo" :disabled="voteId > 0">
                    <template #append>
                      <el-icon @click="onClickToCopy(voteTo)"><document-copy /></el-icon>
                    </template>
                  </el-input>
                </td>                   
              </tr>          
            </table>
          </template>
          <template #footer>
            <div 
              style="flex: auto"
              v-loading="loadDrawerStatus" 
              element-loading-text="Submitting..."
              :element-loading-spinner="svg"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="#ffffff"
            >
              <el-button @click="cancelVoteUpdate">cancel</el-button>
              <el-button type="primary" @click="confirmVoteUpdate">confirm</el-button>
            </div>
          </template>
        </el-drawer>    
      </el-header>
      <el-main
        style="height: 450px;margin-top: 20px;" 
        v-loading="loadStatus"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="#ffffff"
      >
        <el-row :gutter="20">
          <template v-for="info in web3VoteList" :key="info.voteId">
            <el-col :span="8">
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-popover placement="bottom-start" :width="230" title="Vote Info">
                      <template #reference>
                        <span>
                          <el-link type="success" target="_blank" :href="tokenExplorerUrl(web3vote.getAddress(),info.voteId)">{{info.voteName}}
                          </el-link>
                        </span>
                      </template>
                      <h4>Title: {{info.voteName}}</h4>
                      <h4>Owner: 
                        <el-link type="success" target="_blank" :href="addressExplorerUrl(info.voteOwner)">{{info.voteOwner}}</el-link>
                      </h4>
                      <h4>Receiver: 
                        <el-link type="success" target="_blank" :href="addressExplorerUrl(info.voteTo)">{{info.voteTo}}</el-link>
                      </h4>
                      <h4>Description: {{info.voteDesc}}</h4>
                    </el-popover>
                    <span>
                      <el-button v-if="activeName === 'mine'" type="danger" style="float: right;" size="small" @click="onDeleteWeb3Vote(info.voteId)"><el-icon><Delete /></el-icon></el-button>
                      <el-button v-if="activeName === 'mine'" type="primary" style="float: right;" size="small" @click="onEditWeb3Vote(info)"><el-icon><Edit /></el-icon></el-button>
                    </span>  
                  </div>
                </template>
                <el-row>
                  <span>{{info.voteDesc}}</span>
                </el-row>
                <el-row style="float: right;">
                  <el-progress
                    style="width: 220px;float: right;"
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="(100*info.voteAggree/info.totalMembers)"
                    status="success"
                  >
                    <span>Aggree: {{info.voteAggree + '/' + info.totalMembers}}</span>
                  </el-progress>
                </el-row>
                <el-row style="float: right;">
                  <el-progress
                    style="width: 220px;float: right;"
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="(100*info.voteAgainst/info.totalMembers)"
                    status="exception"
                  >
                    <span>Against: {{info.voteAgainst + '/' + info.totalMembers}}</span>
                  </el-progress>
                </el-row>
                <el-row style="float: right;">
                  <span v-if="info.voteType===0" style="float: right;">Vote Value: {{info.voteValue}}</span>
                  <span v-if="info.voteType===1" style="float: right;">Request Token: {{info.voteValue + ' ' + info.tokenSymbol}}</span>
                  <span v-if="info.voteType===2" style="float: right;">MaxTotalSupply: {{info.voteValue}}</span>
                  <span v-if="info.voteType===3" style="float: right;">MaxUserSupply: {{info.voteValue}}</span>
                  <span v-if="info.voteType===4" style="float: right;">MaxUserHates: {{info.voteValue}}</span>
                  <span v-if="info.voteType===5" style="float: right;">MinUserAggrees: {{info.voteValue}}</span>
                  <span v-if="info.voteType===6" style="float: right;">MaxUserVotes: {{info.voteValue}}</span>
                </el-row>
                <el-row v-if="info.voteEnded === false && info.votePayed === false" style="float: right;">
                  <span style="float: right;">Endtime: {{(new Date(info.endTime*1000)).toLocaleString()}}</span>
                </el-row>
                <el-row v-if="info.voteEnded === true || info.votePayed === true" style="float: right;">
                  <span style="float: right;">Vote Result: {{info.voteSuccess ? 'pass' : 'fail'}}</span>
                </el-row>
                <el-row style="float: right;">
                  <el-link v-if="info.voteEnded === false && info.votePayed === false" type="primary" style="float: right;" @click="onVote(info.voteId, 'aggree')">Aggree</el-link>
                  <el-link v-if="info.voteEnded === false && info.votePayed === false" type="primary" style="float: right;" @click="onVote(info.voteId, 'against')">Against</el-link>
                  <el-link v-if="info.voteEnded === false && info.votePayed === false" type="primary" style="float: right;" @click="onVote(info.voteId, 'revoke')">Revoke</el-link>
                </el-row>
              </el-card>
            </el-col>
          </template>
        </el-row>
      </el-main>
      <el-footer>
        <div>
          <el-button type="primary" style="margin-top: 10px;" @click="onHandlePrev">Prev
          </el-button>
          <el-button type="primary" style="margin-top: 10px;" @click="onHandleNext" :disabled="!hasMore">Next
          </el-button>          
      </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VotesPage',
  props: {
  }
}
</script>

<script setup lang="ts">
  
import { ref } from "vue"
import { connected, connectState } from "../libs/connect"
import * as constant from "../constant"
import * as element from "../libs/element"
import * as tools from "../libs/tools"

import { ERC20 } from "../libs/erc20"
import { ERC721 } from "../libs/erc721"

import * as web3vote from "../libs/web3vote"

const activeName = connectState.activeName;
const loadStatus = ref(false);
const loadDrawerStatus = ref(false);

const showAddNewVoteVisiable = ref(false);
const voteId = ref(0);
const voteTitle = ref('');
const voteDescription = ref('');
const voteType = ref(0);
const voteToken = ref('');
const voteValue = ref(0);
const voteTo = ref('');
const voteEndTime = ref('');

const web3VoteList = ref(new Array());
const hasMore = ref(false);
const pageSize = ref(6);
const pageCount = ref(0);

const zeroAddress = '0x0000000000000000000000000000000000000000';
const timeFormat = "YYYY/MM/DD hh:mm:ss";

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
     
//address explore url
const tokenExplorerUrl = (address:string, tokenId:string = '') => {
  for(const i in constant.chainList){
    if(connectState.chainId === constant.chainList[i].chainId){
      const blockExplorerUrls = constant.chainList[i].blockExplorerUrls;
      if(tokenId != ''){
        return `${blockExplorerUrls}/token/${address}?a=${tokenId}#inventory`
      }
      return `${blockExplorerUrls}/token/${address}`
    }
  }
  return address;
}

//address explore url
const addressExplorerUrl = (address:string) => {
  for(const i in constant.chainList){
    if(connectState.chainId === constant.chainList[i].chainId){
      const blockExplorerUrls = constant.chainList[i].blockExplorerUrls;
      return `${blockExplorerUrls}/address/${address}`
    }
  }
  return address;
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

//get block chain native currency
const getTokenCurencyName = async (token:string) => {
  if(token === zeroAddress){
    for(const i in constant.chainList){
      if(constant.chainList[i].chainId === connectState.chainId){
        return constant.chainList[i].nativeCurrency;
      }
    }
  }else{
    const erc20 = new ERC20(token);
    return await erc20.symbol();
  }
}

//on click to copy address
const onClickToCopy = async (content:string) => {
  tools.clickToCopy(content);
  
  element.elMessage('success', 'Copy ' + content + ' to clipboard success.');     
};

//click to open the drawer to create a new vote
const onAddWeb3Vote = async () => {
  voteId.value = 0;
  voteTitle.value = '';
  voteDescription.value = '';
  voteType.value = 0;
  voteToken.value = zeroAddress;
  voteValue.value = 0;
  voteTo.value = zeroAddress;

  const now = new Date();
  now.setTime(now.getTime() + 30*24*3600*1000);

  voteEndTime.value = now.toLocaleString();  

  showAddNewVoteVisiable.value = true;
}

//click to open the drawer to edit the vote
const onEditWeb3Vote = async (voteInfo:any) => {
  voteId.value = voteInfo.voteId;
  voteTitle.value = voteInfo.voteName;
  voteDescription.value = voteInfo.voteDesc;
  voteType.value = voteInfo.voteType;
  voteToken.value = voteInfo.voteToken;
  voteValue.value = voteInfo.voteValue;
  voteTo.value = voteInfo.voteTo;

  voteEndTime.value = (new Date(voteInfo.endTime*1000)).toLocaleString();

  showAddNewVoteVisiable.value = true; 
}

//click to cancle vote update or create
const cancelVoteUpdate = async () => {
  showAddNewVoteVisiable.value = false;
}

//click to confirm to update or create the vote
const confirmVoteUpdate = async () => {
  try{
    loadDrawerStatus.value = true;

    const endTime = new Date(voteEndTime.value).getTime()/1000;

    if(voteId.value > 0){
      const tx = await web3vote.updateVote(voteId.value, voteTitle.value, voteDescription.value, endTime);
      connectState.transactions.value.unshift(tx);
      connectState.transactionCount.value++;
      const msg = `<div><span>Update vote success! Transaction: </span><a href="${transactionExplorerUrl(tx)}" target="_blank">${tx}</a></div>`;
      element.elMessage('success', msg, true);   
    }else{
      const tx = await web3vote.mint(voteTitle.value, voteDescription.value, voteType.value, voteValue.value, voteToken.value, voteTo.value, endTime);
      connectState.transactions.value.unshift(tx);
      connectState.transactionCount.value++;
      const msg = `<div><span>Create vote success! Transaction: </span><a href="${transactionExplorerUrl(tx)}" target="_blank">${tx}</a></div>`;
      element.elMessage('success', msg, true);    
    }

    showAddNewVoteVisiable.value = false;

    handleClick();
  }catch(e){
    element.alertMessage(e);
  }finally{
    loadDrawerStatus.value = false;
  }
}

//click to delete a web3 vote
const onDeleteWeb3Vote = async (voteId:number) => {
  try{
    const tx = await web3vote.burn(voteId);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;
    const msg = `<div><span>Delete vote success! Transaction: </span><a href="${transactionExplorerUrl(tx)}" target="_blank">${tx}</a></div>`;
    element.elMessage('success', msg, true);       

    handleClick();
  }catch(e){
    element.alertMessage(e);
  }
}

//click to cast a vote
const onVote = async (voteId:number, voteType:string) => {
  let status = 0;

  if(voteType === 'aggree'){
    status = 1;
  }else if(voteType === 'against'){
    status = 2;
  }else{
    status = 0;
  }

  try{
    const tx = await web3vote.vote(voteId, status);
    connectState.transactions.value.unshift(tx);
    connectState.transactionCount.value++;
    const msg = `<div><span>Cast the vote success! Transaction: </span><a href="${transactionExplorerUrl(tx)}" target="_blank">${tx}</a></div>`;
    element.elMessage('success', msg, true);       

    handleClick();
  }catch(e){
    element.alertMessage(e);
  }  
}

//get web3 vote infos by page size and page count
const getWeb3VoteCount = async (onlyOwner:boolean) => {
  const indexs = await web3vote.getVoteIndexsByPageCount(pageSize.value, pageCount.value, onlyOwner);

  if(indexs.length < pageSize.value){
    hasMore.value = false;
  }else{
    hasMore.value = true;
  }

  const erc721 = new ERC721((constant.nftContractAddress as any)[connectState.chainId]);

  const infoList = new Array();
  for(const i in indexs){
    const res = await web3vote.getVoteInfoById(indexs[i]);

    res.voteEnded = res.endTime < (new Date().getTime()/1000);
    res.voteOwner = await web3vote.ownerOf(indexs[i]);
    res.tokenSymbol = await getTokenCurencyName(res.voteToken);
    res.isOwner = res.voteOwner.toLowerCase() === connectState.userAddr.value.toLowerCase();
    res.totalMembers = await erc721.totalSupply();

    infoList.push(res);
  }

  web3VoteList.value = infoList;  
}

//on click for prev page
const onHandlePrev = async () => {
  if(pageCount.value > 0){
    pageCount.value--;
  }
  handleClick();
}

//on click for next page
const onHandleNext = async () => {
  if(hasMore.value){
    pageCount.value++;
  }
  handleClick();
}

//handle page refresh
const handleClick = async () => {
  //wait for the active name change
  await tools.sleep(100);
    
  connectState.activeName.value = activeName.value;
  tools.setUrlParamter('activeName', activeName.value);
  try{
    loadStatus.value = true;
    if (!(await connected())){
      web3VoteList.value = new Array();
      return;
    }

    if(pageCount.value < 0){
      pageCount.value = 0;
    }

    const onlyOwner = activeName.value === 'mine';

    await getWeb3VoteCount(onlyOwner);

  }catch(e){
    web3VoteList.value = new Array();
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
  if(activeName.value != 'all' && 
    activeName.value != 'mine'){
    activeName.value = 'all';
  }
}catch(e){
  activeName.value = 'all';
}
//update page size
handleClick();
</script>