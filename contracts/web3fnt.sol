//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

enum NftType {
    IMAGE,
    AUDIO,
    VIDEO,
    DOCS,
    FOLDER,
    WEBSITE
}

struct NftInfo {
    NftType tokenType; 
    uint tokenLikes;
    uint tokenHates;
    uint256 tokenRewards;
    uint256 tokenPrices;
    string tokenUrl;
    string tokenSecret;
}

contract Web3NFT is ERC721Enumerable, ERC721URIStorage {

    using Counters for Counters.Counter;
    
    //nft id
    Counters.Counter private _tokenId;
    
    //max nft supply
    uint private _maxTotalSupply;

    //max one user nft supply
    uint private _maxUserSupply;

    //max one user hates when he need to be put into blacklist
    uint private _maxUserHates;

    //store nft token infos
    mapping(uint256 => NftInfo) private _tokenInfos;

    //store like/hates status  
    mapping(uint256 => mapping(address => uint)) private addressStatus;

    //store nft uris
    mapping(string => bool) private _tokenUri;

    //store operator
    address private _operator;

    //store owner
    address private _owner;

    constructor() ERC721("Web3NFT", "WNFT") {
        _maxTotalSupply = 15000;
        _maxUserSupply = 5;
        _maxUserHates = 1000;

        _operator = msg.sender;
        _owner = msg.sender;
    }

    //set operator
    function updateOperator(address operator) public {
        require(msg.sender == _owner);
    
        _operator = operator;
    }

    //set max total supply
    function updateMaxTotalSupply(uint max) public {
        require(msg.sender == _operator);
        require(max >= 10000 && max <= 30000);

        _maxTotalSupply = max;
    }

    //set max user supply
    function updateMaxUserSupply(uint max) public {
        require(msg.sender == _operator);
        require(max >= 1 && max <= 10);

        _maxUserSupply = max;
    }

    //set max user hates
    function updateMaxUserHates(uint max) public {
        require(msg.sender == _operator);
        require(max >= 500 && max <= 3000);

        _maxUserHates = max;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function isAddressForbidded(address user) public view returns (bool){
        uint256 balance = balanceOf(user);
        uint hates = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            if(_tokenInfos[tokenId].tokenHates > _tokenInfos[tokenId].tokenLikes){
                hates += _tokenInfos[tokenId].tokenHates - _tokenInfos[tokenId].tokenLikes;
            }
        }        

        return hates > _maxUserHates;
    }

    function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }    

    function mint(NftType tokenType, string memory tokenURI, string memory tokenSecret) public returns (uint256) {

        require(bytes(tokenURI).length > 0, "invalid token url!");

        require(_tokenUri[tokenURI] == false, "token url exists!");

        require(totalSupply() < _maxTotalSupply, "reach total supply!");

        require(balanceOf(msg.sender) < _maxUserSupply, "reach user supply!");

        require(isAddressForbidded(msg.sender) == false, "user banned!");

        _tokenId.increment();

        uint256 newId = _tokenId.current();

        _mint(msg.sender, newId);

        _setTokenURI(newId, tokenURI);

        _tokenUri[tokenURI] = true;

        _tokenInfos[newId] = NftInfo({
            tokenType: tokenType,
            tokenLikes: 0,
            tokenHates: 0,
            tokenRewards: 0,
            tokenPrices: 0,
            tokenUrl: tokenURI,
            tokenSecret: tokenSecret
        });

        return newId;
    }

    function burn(uint256 tokenId) public payable returns (bool) {
        require(ownerOf(tokenId) == msg.sender, "only owner allowed!");

        string memory toeknUri = tokenURI(tokenId);
        
        uint256 rewards = _tokenInfos[tokenId].tokenRewards;
        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        delete _tokenInfos[tokenId];

        delete _tokenUri[toeknUri];

        _burn(tokenId);

        return true;
    }  

    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function hateNft(uint256 tokenId) public returns (bool){
       require(isAddressForbidded(msg.sender) == false, "user banned!");

        if(ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if (addressStatus[tokenId][msg.sender] == 2){
            _tokenInfos[tokenId].tokenLikes--;
        }         

        if(addressStatus[tokenId][msg.sender] != 1){
            addressStatus[tokenId][msg.sender] = 1;
            _tokenInfos[tokenId].tokenHates++;
        }

        return true;
    }

    function likeNft(uint256 tokenId) public returns (bool){
       require(isAddressForbidded(msg.sender) == false, "user banned!");

        if(ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if (addressStatus[tokenId][msg.sender] == 1){
            _tokenInfos[tokenId].tokenHates--;
        }         

        if(addressStatus[tokenId][msg.sender] != 2){
            addressStatus[tokenId][msg.sender] = 2;
            _tokenInfos[tokenId].tokenLikes++;
        }      

        return true;
    }

    function rewardNft(uint256 tokenId) public payable returns (bool){
        if(ownerOf(tokenId) == address(0x0)){
            return false;
        }

        _tokenInfos[tokenId].tokenRewards += msg.value;        
    }

    function claim() public payable returns (bool){
        require(isAddressForbidded(msg.sender) == false, "user banned!");

        uint256 balance = balanceOf(msg.sender);
        uint256 rewards = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
            rewards += _tokenInfos[tokenId].tokenRewards;
            _tokenInfos[tokenId].tokenRewards = 0;
        }

        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        return true;
    }

    function getNftInfoByIndex(uint256 tokenId) public view returns (NftInfo memory){
        NftInfo memory info = _tokenInfos[tokenId];

        //not the owner and not for sell
        if(msg.sender != ownerOf(tokenId) && _tokenInfos[tokenId].tokenPrices == 0){
            info.tokenSecret = '';
        }

        return info;
    }

    function minted(string memory tokenURI) public view returns (bool){
        return _tokenUri[tokenURI];
    }

    function sellNFT(uint256 tokenId, uint256 tokenPrice) public returns (bool){
        require(isAddressForbidded(msg.sender) == false, "user banned!");

        require(ownerOf(tokenId) == msg.sender, "only owner allowed!");

        if(tokenPrice > 0 ){
            approve(address(this), tokenId);
        }

        _tokenInfos[tokenId].tokenPrices = tokenPrice;

        return true;
    }

    function buyNFT(uint256 tokenId) public payable returns (bool){
        address owner = ownerOf(tokenId);

        require(isAddressForbidded(msg.sender) == false, "user banned!");

        require(ownerOf(tokenId) != msg.sender, "owner not allowed!");

        require(_tokenInfos[tokenId].tokenPrices > 0, "not for sell!");

        require(msg.value >= _tokenInfos[tokenId].tokenPrices, "invalid price!");

        ERC721(address(this)).safeTransferFrom(owner, msg.sender, tokenId);

        payable(owner).transfer(msg.value);

        _tokenInfos[tokenId].tokenPrices = 0;

        return true;
    }

    function getNFTPrameters() public view returns (uint, uint, uint){
        return (
            _maxTotalSupply, 
            _maxUserSupply, 
            _maxUserHates
        );
    }

    function getAddressPrameters() public view returns (uint256, uint256, uint256, bool){
        uint256 balance = balanceOf(msg.sender);
        uint256 rewards = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
            rewards += _tokenInfos[tokenId].tokenRewards;         
        }             

        return (
            totalSupply(), 
            balance, 
            rewards, 
            isAddressForbidded(msg.sender)
        );
    }
}