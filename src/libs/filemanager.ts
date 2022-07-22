// example imports 
import { providers, Contract } from "ethers"

import { fileContractAddress } from "../constant"

import {networkConnect, connectState} from "./connect"

//contract abis
const abi = [
	"function addFile(string fileName, string fileId, uint8 fileType, uint fileSize, bool isEncrypt) public returns (uint256)",
	"function delFile(uint256 fileId) public returns (bool)",
	"function getIndexsByFileType(uint8 fileType) public view returns(uint256[])",
	"function checkFile(string fileName) public view returns (bool)",
	"function getFileInfoByIndex(uint256 fileId) public view returns (tuple(string,string,uint8,uint,bool))",
];

//get contract provider
export const getContract = async () => {
  await networkConnect();

  return new Contract((fileContractAddress as any)[connectState.chainId], abi, connectState.signer);	
}

//add a file to the smart contract
export const addFile = async (filename:string, fileid:string, filetype:string, filesize:number, isEncrypt:boolean = false) => {
	filename = filename.trim();
	if(filename===''){
		throw new Error("file name is empty!");
	}

	let types = 0;
	switch (filetype){
		case 'image':
			types = 0;
			break;
		case 'audio':
			types = 1;
			break;
		case 'video':
			types = 2;
			break;
		case 'docs':
			types = 3;
			break;
		case 'folder':
			types = 4;
			break;
		case 'website':
			types = 5;
			break;
		default:
			throw new Error("invalid filetype!");
			break;
	}

	fileid = fileid.trim();
	if(fileid===''){
		throw new Error("file id is empty!");
	}

	filesize = Math.floor(filesize);
	if(filesize<=0){
		throw new Error("file size must large than zero!");
	}

	const contract = await getContract();
	const tx = await contract.addFile(filename, fileid, types, filesize, isEncrypt);
  await tx.wait()

  return tx.hash;
}

//delete a file from the smart contract
export const delFile = async (fileid:number) => {
	if(fileid < 1){
		throw new Error("file id must large than zero!");
	}

	const contract = await getContract();
	const tx = await contract.delFile(fileid);
  await tx.wait()

  return tx.hash;
}

export const checkFile = async (filename:string) => {
	filename = filename.trim();
	if(filename===''){
		throw new Error("file name is empty!");
	}

	const contract = await getContract();

	return await contract.checkFile(filename);
}

//get file indexs by file type, like image/audio/video/folder/website
export const getIndexsByFileType = async (filetype:string) => {
	let types = 0;
	switch (filetype){
		case 'image':
			types = 0;
			break;
		case 'audio':
			types = 1;
			break;
		case 'video':
			types = 2;
			break;
		case 'docs':
			types = 3;
			break;
		case 'folder':
			types = 4;
			break;
		case 'website':
			types = 5;
			break;
		default:
			throw new Error("invalid filetype!");
			break;
	}

	const contract = await getContract();

	return await contract.getIndexsByFileType(types);
}

//get file info by index
export const getFileInfoByIndex = async (index:number) => {
	index = Math.floor(index);
	if(index < 0){
		throw new Error("index must large than zero!");
	}

	const contract = await getContract();

	return await contract.getFileInfoByIndex(index);
}