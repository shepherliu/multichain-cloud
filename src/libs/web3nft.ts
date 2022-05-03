// example imports 
import { providers, utils, Contract } from "ethers"

import * as constant from "../constant"

import * as connect from "./connect"

//contract abis
const abi = [
	"function mint(string memory tokenType, string memory tokenURI) public returns (uint256)",
	"function burn(uint256 tokenId) public payable returns (bool)",
	"function tokenURI(uint256 tokenId) returns (string memory)",
	"function tokenType(uint256 tokenId) public view returns (string memory)",
	"function hateNft(uint256 tokenId) public returns (bool)",
	"function likeNft(uint256 tokenId) public returns (bool)",
	"function rewardNft(uint256 tokenId) public payable returns (bool)",
	"function claim() public payable returns (bool)",
	"function getHates(uint256 tokenId) public view returns (uint256)",
	"function getLikes(uint256 tokenId) public view returns (uint256)",
	"function getTokenRewards(uint256 tokenId) public view returns (uint256)",
	"function getAddressRewards(address addr) public view returns (uint256)",
	"function balanceOf(address owner) public view returns (uint256)",
	"function ownerOf(uint256 tokenId) public view returns (address)",
	"function tokenByIndex(uint256 index) public view returns (uint256)",
	"function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
	"function totalSupply() public view returns (uint256)",
	"function minted(string memory tokenURI) public view returns (bool)",
];

//get contract provider
export const getContract = async () => {
  await connect.networkConnect();

  return new Contract(constant.nftContractAddress, abi, connect.connectState.signer);	
}

export const mint = async (tokenType:string, tokenURI:string) => {
	tokenType = tokenType.trim();
	if(tokenType!="image"&&tokenType!="audio"&&tokenType!="video"){
		throw new Error("unknow token type!");
	}

	tokenURI = tokenURI.trim();
	if(tokenURI===''){
		throw new Error("token uri is empty!");
	}

	const contract = await getContract();
	const tx = await contract.mint(tokenType, tokenURI);
  await tx.wait()

  return tx.hash;	
}

export const burn = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();
	const tx = await contract.burn(tokenId);
  await tx.wait()

  return tx.hash;		
}

export const tokenURI = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();
	return await contract.tokenURI(tokenId);
}

export const tokenType = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();
	return await contract.tokenType(tokenId);	
}

export const hateNft = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();
	const tx = await contract.hateNft(tokenId);
  await tx.wait()

  return tx.hash;			
}

export const likeNft = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();
	const tx = await contract.likeNft(tokenId);
  await tx.wait()

  return tx.hash;		
}

export const rewardNft = async(tokenId:number, reward:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	if(reward<=0){
		throw new Error("reward must large than zero!");
	}

	const options = {value: utils.parseEther(String(reward))};

	const contract = await getContract();
	const tx = await contract.rewardNft(tokenId, options);
  await tx.wait()

  return tx.hash;		
}

export const claim = async () => {
	const contract = await getContract();
	const tx = await contract.claim();
	await tx.wait()

	return tx.hash;
} 

export const getHates = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();

	return await contract.getHates(tokenId);
}

export const getLikes = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();

	return await contract.getLikes(tokenId);
}

export const getTokenRewards = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();

	return await contract.getTokenRewards(tokenId);
}

export const getAddressRewards = async (addr:string) => {
	addr = addr.trim();
	if(addr===''){
		throw new Error("address is empty!");
	}

	const contract = await getContract();

	return await contract.getAddressRewards(addr);
}

export const balanceOf = async (addr:string) => {
	addr = addr.trim();
	if(addr===''){
		throw new Error("address is empty!");
	}

	const contract = await getContract();

	return await contract.balanceOf(addr);
}

export const ownerOf = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();

	return await contract.ownerOf(tokenId);
}

export const tokenByIndex = async (index:number) => {
	index = Math.floor(index);
	if(index < 0){
		throw new Error("invalid token index!");
	}

	const contract = await getContract();

	return await contract.tokenByIndex(index);
}

export const tokenOfOwnerByIndex = async (addr:string, index:number) => {
	index = Math.floor(index);
	if(index < 0){
		throw new Error("invalid token index!");
	}
	addr = addr.trim();
	if(addr===''){
		throw new Error("address is empty!");
	}	

	const contract = await getContract();

	return await contract.tokenOfOwnerByIndex(addr, index);
}

export const totalSupply = async () => {
	const contract = await getContract();

	return await contract.totalSupply();
}

export const minted = async (tokenURI:string) => {
	tokenURI = tokenURI.trim();
	if(tokenURI===''){
		throw new Error("token uri is empty!");
	}

	const contract = await getContract();

	return await contract.minted(tokenURI);
}
