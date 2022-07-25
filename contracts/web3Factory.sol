//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { Web3NFT } from "./web3Nft.sol";
import { Web3Vote } from "./web3Vote.sol";
import { FileManager } from "./filemanager.sol";

contract Web3Factory {
    address private _owner;
    address private _web3file;
    address private _web3nft;
    address private _web3vote;

    constructor() {
        _owner = msg.sender;
        _web3file = address(new FileManager());
        _web3nft = address(new Web3NFT());
        _web3vote = address(new Web3Vote());

        Web3NFT(_web3nft).updateOperator(_web3vote);
        Web3Vote(_web3vote).updateContracts(_web3nft);
    }

    function getFactoryInfo() public view returns(address, address, address){
        return (_web3file, _web3nft, _web3vote);
    }
}