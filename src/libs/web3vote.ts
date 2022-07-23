// example imports 
import { providers, utils, Contract } from "ethers"

import {voteContractAddress} from "../constant"

import {networkConnect, connectState} from "./connect"

import { ERC20 } from "./erc20"

//contract abis
const abi = [
	"function safeTransferFrom(address from, address to, uint256 tokenId)",
	"function balanceOf(address owner) public view returns (uint256)",
	"function ownerOf(uint256 tokenId) public view returns (address)",
	"function tokenByIndex(uint256 index) public view returns (uint256)",
	"function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
	"function totalSupply() public view returns (uint256)",
	"function mint(string name, string desc, uint8 voteType, uint256 value, address token, address to, uint endTime) public returns (uint256)",
	"function burn(uint256 voteId) public returns (bool)",
	"function updateVote(uint256 voteId, string name, string desc, uint endTime) public returns (bool)",
	"function vote(uint256 voteId, uint8 status) public returns (bool)",
	"function getVoteTotalCount(bool onlyOwner) public view returns (uint)",
	"function getVoteInfoById(uint256 voteId) public view returns (tuple(string, string, uint8, uint256, address, address, uint, uint, uint, bool, bool))",
	"function getVoteIndexsByPageCount(uint pageSize, uint pageCount, bool onlyOwner) public view returns(uint256[])",
];

const zeroAddress = '0x0000000000000000000000000000000000000000';

//get contract provider
export const getContract = async () => {
  await networkConnect();

  return new Contract((voteContractAddress as any)[connectState.chainId], abi, connectState.signer);	
}

export const getAddress = () => {
	return (voteContractAddress as any)[connectState.chainId];
}
//safetransfer from
export const safeTransferFrom = async (from:string, to:string, tokenId:number) => {
	from = from.trim();
	if(from === ''){
		throw new Error("from address is empty!");
	}
	to = to.trim();
	if(to === ''){
		throw new Error("to address is empty!");
	}
	if(from === to){
		throw new Error("from address can not be the same as to address!");
	}
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}	

	const contract = await getContract();
	const tx = await contract.safeTransferFrom(from, to, tokenId);
  await tx.wait();

  return tx.hash;		
}

//get the amount nfts of user
export const balanceOf = async (addr:string) => {
	addr = addr.trim();
	if(addr===''){
		throw new Error("address is empty!");
	}

	const contract = await getContract();

	return await contract.balanceOf(addr);
}

//get the owner of the nft
export const ownerOf = async (tokenId:number) => {
	tokenId = Math.floor(tokenId);
	if(tokenId < 0){
		throw new Error("invalid token id!");
	}

	const contract = await getContract();

	return await contract.ownerOf(tokenId);
}

//get nft id by index
export const tokenByIndex = async (index:number) => {
	index = Math.floor(index);
	if(index < 0){
		throw new Error("invalid token index!");
	}

	const contract = await getContract();

	return await contract.tokenByIndex(index);
}

//get user nft id by index
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

//get total nfts amount
export const totalSupply = async () => {
	const contract = await getContract();

	return await contract.totalSupply();
}

//mint a new vote
export const mint = async (name:string, desc:string, voteType:number, amount:number, token:string, to:string, endTime:number) => {
	name = name.trim();
	desc = desc.trim();

	if(name.length <= 0){
		throw new Error("invalid vote name!");
	}

	if(desc.length <= 0){
		throw new Error("invalid vote description!");
	}

	if(voteType < 0 || voteType > 6){
		throw new Error("invalid vote type!");
	}

	if(endTime < (new Date()).getTime()/1000){
		throw new Error("invalid grant end time!");
	}		

	const erc20 = new ERC20(token);

	if(voteType === 1 && amount > 0){
		if(amount > await erc20.balanceOf((voteContractAddress as any)[connectState.chainId])){
			throw new Error("invalid amount, large than the dao treassure balance!");
		}
	}

	const contract = await getContract();

	let value;

	if(voteType === 1){
		if(token === zeroAddress){
			value = utils.parseEther(String(amount));
		}else{
			value = utils.parseUnits(String(amount), await erc20.decimals());
		}
	}else{
		value = amount;
	}

	const tx = await contract.mint(name, desc, voteType, value, token, to, endTime);

	await tx.wait();

	return tx.hash;				
}

//burn a vote
export const burn = async (voteId:number) => {
	if(voteId <= 0){
		throw new Error("invalid vote id!");
	}

	const contract = await getContract();

	const tx = await contract.burn(voteId);

	await tx.wait();

	return tx.hash;
}

//update a vote info
export const updateVote = async (voteId:number, name:string, desc:string, endTime:number) => {
	if(voteId <= 0){
		throw new Error("invalid vote id!");
	}

	name = name.trim();
	desc = desc.trim();
	if(name.length <= 0){
		throw new Error("invalid vote name!");
	}		

	if(endTime > 0 && endTime < (new Date()).getTime()/1000){
		throw new Error("invalid grant end time!");
	}else{
		endTime = 0;
	}	

	const contract = await getContract();

	const tx = await contract.updateVote(voteId, name, desc, endTime);

	await tx.wait();

	return tx.hash;		
}

//vote events
export const vote = async (voteId:number, status:number) => {
	if(voteId <= 0){
		throw new Error("invalid vote id!");
	}

	if(status < 0 || status > 2){
		throw new Error("invalid vote status!");
	}

	const contract = await getContract();

	const tx = await contract.vote(voteId, status);

	await tx.wait();

	return tx.hash;		
}

//get vote total count
export const getVoteTotalCount = async (onlyOwner:boolean) => {
	const contract = await getContract();

	const res = await contract.getVoteTotalCount(onlyOwner);

	return res.toNumber();
}

//todo parse vote info
export const getVoteInfoById = async (voteId:number) => {
	if(voteId <= 0){
		throw new Error("invalid vote id!");
	}

	const contract = await getContract();

	const res = await contract.getVoteInfoById(voteId);

	const voteType = res[2];
	const payContract = res[4];

	let value;

	if(voteType === 1){
		if(payContract === zeroAddress){
			value = Number(utils.formatEther(res[3]));
		}else{
			const erc20 = new ERC20(payContract);
			const decimals = await erc20.decimals();

			value = Number(utils.formatUnits(res[3], decimals));
		}
	}else{
		value = res[3].toNumber();
	}

	return {
		voteId: voteId,
		voteName: res[0],
		voteDesc: res[1],
		voteType: voteType,
		voteValue: value,
		voteToken: payContract,
		voteTo: res[5],
		voteAggree: res[6].toNumber(),
		voteAgainst: res[7].toNumber(),
		endTime: res[8].toNumber(),
		voteSuccess: res[9],
		votePayed: res[10],
	};
}

//get vote indexs by page count
export const getVoteIndexsByPageCount = async (pageSize:number, pageCount:number, onlyOwner:boolean) => {
	if(pageSize <= 0 || pageSize > 100){
		throw new Error("invalid page size!");
	}

	if(pageCount < 0){
		throw new Error("invalid page count!");
	}

	const contract = await getContract();

	const indexList = [];

	const res = await contract.getVoteIndexsByPageCount(pageSize, pageCount, onlyOwner);

	for(const i in res){
		indexList.push(res[i].toNumber());
	}

	return indexList;
}