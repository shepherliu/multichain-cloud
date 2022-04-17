// example imports 
import { providers, utils, Contract } from "ethers"

import * as constant from "../constant"

import * as connect from "./connect"

//contract abis
const abi = [
	"function addFile(string calldata name, string calldata id)",
	"function shareFile(string calldata id) public returns (bool)",
	"function delFile(string calldata id) public returns (bool)",
	"function privateFile(string calldata id) public returns (bool)",
	"function getFileCount() public view returns(uint)",
	"function getFileIdByIndex(uint index) public view returns (string memory, string memory, bool)",
	"function getShareCount() public view returns(uint)",
	"function getShareIdByIndex(uint index) public view returns (string memory, string memory, bool)",
];

//get contract provider
export const getContract = async () => {
  await connect.networkConnect();

  return new Contract(constant.contractAddress, abi, connect.connectState.signer);	
}

//add file id to smart contract
export const addFile = async (name:string, id:string) => {
  const contract = await getContract();

  name = name.trim();
  if(name == ''){
    throw new Error("name is empty!");
  }

  id = id.trim();
  if(id == ''){
  	throw new Error("id is empty!");
  }

  const tx = await contract.addFile(name, id);
  await tx.wait()

  return tx.hash;
}

//share file id to smart contract, so others can view this file
export const shareFile = async (id:string) => {
  const contract = await getContract();

  id = id.trim();
  if(id == ''){
  	throw new Error("id is empty");
  }  

  const tx = await contract.shareFile(id);
  await tx.wait()

  return tx.hash;  
}

//delete file id from smart contract
export const delFile = async (id:string) => {
  const contract = await getContract();

  id = id.trim();
  if(id == ''){
  	throw new Error("id is empty");
  }  

  const tx = await contract.delFile(id);
  await tx.wait()

  return tx.hash;  
}

//delete file id from the share list, so others can not view it anymore
export const privateFile = async (id:string) => {
  const contract = await getContract();

  id = id.trim();
  if(id == ''){
  	throw new Error("id is empty");
  }  

  const tx = await contract.privateFile(id);
  await tx.wait()

  return tx.hash;  
}

//get files count
export const getFileCount = async () => {
  const contract = await getContract();

  return await contract.getFileCount();
}

//get file id by index
export const getFileIdByIndex = async (index:number) => {
  const contract = await getContract();

  index = Math.floor(index);

  return await contract.getFileIdByIndex(index);
}

//get share count
export const getShareCount = async () => {
  const contract = await getContract();

  return await contract.getShareCount();
}

//get shared file id by index
export const getShareIdByIndex = async (index:number) => {
  const contract = await getContract();

  index = Math.floor(index);

  return await contract.getShareIdByIndex(index);
}