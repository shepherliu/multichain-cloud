//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Web3NFT is ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    mapping(uint256 => string) private _tokenType;

    mapping(string => bool) private _tokenUri;

    mapping(uint256 => uint256) private _hates;

    mapping(uint256 => uint256) private _likes;

    mapping(uint256 => uint256) private _rewards;

    mapping(address => mapping(uint256 => bool)) private _addressHates;

    mapping(address => mapping(uint256 => bool)) private _addressLikes;

    constructor() ERC721("Web3NFT", "WNFT") {}

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }    

    //compare two string is equal or not
    function isStringEqual(string memory src, string memory dst) internal pure returns(bool){
        bytes memory a = bytes(src);
        bytes memory b = bytes(dst);

        if(a.length != b.length){
            return false;
        }

        if(a.length == 0){
            return true;
        }

        for(uint i=0; i<a.length; i++){
            if(a[i] != b[i]){
                return false;
            }
        }

        return true;
    }

    function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }    

    function mint(string memory tokenType, string memory tokenURI) public returns (uint256) {
        if(!isStringEqual(tokenType, "image")&&!isStringEqual(tokenType, "audio")&&!isStringEqual(tokenType, "video")){
            revert("unknow token type!");
        }

        if(bytes(tokenURI).length == 0){
            revert("token uri is empty!");
        }

        if(_tokenUri[tokenURI]){
            revert("token uri has already used!");
        }

        _tokenId.increment();
        uint256 newTokenId = _tokenId.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _tokenType[newTokenId] = tokenType;
        _tokenUri[tokenURI] = true;

        return newTokenId;
    }

    function burn(uint256 tokenId) public payable returns (bool) {
        if (ownerOf(tokenId) != msg.sender){
            revert("only nft owner can burn it!");
        }

        string memory toeknUri = tokenURI(tokenId);
        
        uint256 rewards = _rewards[tokenId];
        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        _hates[tokenId] = 0;
        _likes[tokenId] = 0;
        _rewards[tokenId] = 0;
        _tokenType[tokenId] = "";
        _tokenUri[toeknUri] = false;

        _burn(tokenId);

        return true;
    }  

    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function tokenType(uint256 tokenId) public view returns (string memory) {
        return _tokenType[tokenId];
    }

    function hateNft(uint256 tokenId) public returns (bool){
        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if(_addressHates[msg.sender][tokenId]){
            return true;
        }else{
            _addressHates[msg.sender][tokenId] = true;
            _hates[tokenId]++;
            if(_addressLikes[msg.sender][tokenId]){
                _addressLikes[msg.sender][tokenId] = false;
                _likes[tokenId]--;
            }
        }

        return true;
    }

    function likeNft(uint256 tokenId) public returns (bool){
        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if(_addressLikes[msg.sender][tokenId]){
            return true;
        }else{
            _addressLikes[msg.sender][tokenId] = true;   
            _likes[tokenId]++;     
            if(_addressHates[msg.sender][tokenId]){
                _addressHates[msg.sender][tokenId] = false;
                _hates[tokenId]--;
            }
        }

        return true;
    }

    function rewardNft(uint256 tokenId) public payable returns (bool){
        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        _rewards[tokenId] += msg.value;        
    }

    function claim() public payable returns (bool){
        uint256 balance = super.balanceOf(msg.sender);
        uint256 rewards = 0;

        for(uint256 i = 0; i < balance; i++){
            uint256 tokenId = super.tokenOfOwnerByIndex(msg.sender, i);
            rewards += _rewards[tokenId];
            _rewards[tokenId] = 0;
        }

        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        return true;
    }

    function getHates(uint256 tokenId) public view returns (uint256){
        return _hates[tokenId];
    }

    function getLikes(uint256 tokenId) public view returns (uint256){
        return _likes[tokenId];
    }

    function getTokenRewards(uint256 tokenId) public view returns (uint256){
        return _rewards[tokenId];
    }

    function getAddressRewards(address addr) public view returns (uint256){
        uint256 balance = super.balanceOf(addr);
        uint256 rewards = 0;

        for(uint256 i = 0; i < balance; i++){
            uint256 tokenId = super.tokenOfOwnerByIndex(addr, i);
            rewards += _rewards[tokenId];
        }        

        return rewards;
    }

    function minted(string memory tokenURI) public view returns (bool){
        return _tokenUri[tokenURI];
    }
}