//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Web3NFT is ERC721Enumerable, ERC721URIStorage {
    struct VoteInfo {
        uint256 voteId;
        address voteOwner;
        string voteTitle;
        string voteContent;
        uint voteAggree;
        uint voteDeadline;
        uint voteValue;
        bool voteSuccess;
    }  

    struct NftInfo {
        string tokenType; 
        uint tokenLikes;
        uint tokenHates;
        uint256 tokenRewards;
        uint256 tokenPrices;
        mapping(address => uint)addressStatus;
    }

    using Counters for Counters.Counter;
    
    //nft id
    Counters.Counter private _tokenId;
    //vote id
    Counters.Counter private _voteId;
    //max nft supply
    uint private _maxTotalSupply;
    //max one user nft supply
    uint private _maxUserSupply;
    //max one user hates when he need to be put into blacklist
    uint private _maxUserHates;
    //min vote aggre number to success
    uint private _minVoteAggrees;
    //max user vote that can create
    uint private _maxUserVotes;
    //store nft token infos
    mapping(uint256 => NftInfo) private _tokenInfos;  
    //store vote counts  
    uint private _voteCount;  
    //store vote events
    VoteInfo[] private _voteInfos;
    //store nft uris
    mapping(string => bool) private _tokenUri;
    //store user vote created number
    mapping(address => uint) private _addressVoteCreated;   
    //store user vote status
    mapping(uint256 => mapping(address => uint)) _addressVoteStatus;

    constructor() ERC721("Web3NFT", "WNFT") {
        _maxTotalSupply = 15000;
        _maxUserSupply = 5;
        _maxUserHates = 1000;
        _minVoteAggrees = 5000;
        _maxUserVotes = 2;
    }

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

        for(uint i = 0; i < a.length; i++){
            if(a[i] != b[i]){
                return false;
            }
        }

        return true;
    }

    function isAddressForbidded() internal view returns (bool){
        uint256 balance = super.balanceOf(msg.sender);
        uint hates = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = super.tokenOfOwnerByIndex(msg.sender, i);
            if(_tokenInfos[tokenId].tokenHates > _tokenInfos[tokenId].tokenLikes){
                hates += _tokenInfos[tokenId].tokenHates - _tokenInfos[tokenId].tokenLikes;
            }
        }        

        return hates > _maxUserHates;
    }

    function executeVote(uint index) internal returns (bool){
        uint256 totalNFT = super.totalSupply();

        if(_voteInfos[index].voteAggree < _minVoteAggrees || _voteInfos[index].voteAggree < totalNFT/2){
            return false;
        }

        string memory title = _voteInfos[index].voteTitle;
        uint value = _voteInfos[index].voteValue;

        if(isStringEqual(title, "ChangeMaxTotalSupply")){
            _maxTotalSupply = value;
        }else if(isStringEqual(title, "ChangeMaxUserSupply")){
            _maxUserSupply = value;            
        }else if(isStringEqual(title, "ChangeMaxUserHates")){
            _maxUserHates = value;
        }else if(isStringEqual(title, "ChangeMinVoteAggrees")){
            _minVoteAggrees = value; 
        }else if(isStringEqual(title, "ChangeMaxUserVotes")){
            _maxUserVotes = value;           
        }           

        _voteInfos[index].voteSuccess = true;
        return true;
    }

    function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }    

    function mint(string memory tokenType, string memory tokenURI) public returns (uint256) {
        if(!isStringEqual(tokenType, "image") &&
            !isStringEqual(tokenType, "audio") &&
            !isStringEqual(tokenType, "video")) {
            
            revert("unknow token type!");
        }

        if(bytes(tokenURI).length == 0){
            revert("token uri is empty!");
        }

        if(_tokenUri[tokenURI]){
            revert("token uri has already been used!");
        }

        if(super.totalSupply() >= _maxTotalSupply){
            revert("mint failed for reaching the max total supply!");
        }

        if(super.balanceOf(msg.sender) >= _maxUserSupply){
            revert("mint failed for reaching the max user supply!");
        }

        if(isAddressForbidded()){
            revert("mint failed for you are in blacklist because you got too much unlikes!");
        }

        _tokenId.increment();
        uint256 newTokenId = _tokenId.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _tokenInfos[newTokenId].tokenType = tokenType;
        _tokenUri[tokenURI] = true;

        return newTokenId;
    }

    function burn(uint256 tokenId) public payable returns (bool) {
        if (ownerOf(tokenId) != msg.sender){
            revert("only nft owner can burn it!");
        }

        string memory toeknUri = tokenURI(tokenId);
        
        uint256 rewards = _tokenInfos[tokenId].tokenRewards;
        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        delete _tokenInfos[tokenId];

        _tokenUri[toeknUri] = false;

        _burn(tokenId);

        return true;
    }  

    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function hateNft(uint256 tokenId) public returns (bool){
        if(isAddressForbidded()){
            revert("hate failed for you are in blacklist because you got too much unlikes!");
        }

        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if (_tokenInfos[tokenId].addressStatus[msg.sender] == 2){
            _tokenInfos[tokenId].tokenLikes--;
        }         

        if(_tokenInfos[tokenId].addressStatus[msg.sender] != 1){
            _tokenInfos[tokenId].addressStatus[msg.sender] = 1;
            _tokenInfos[tokenId].tokenHates++;
        }

        return true;
    }

    function likeNft(uint256 tokenId) public returns (bool){
        if(isAddressForbidded()){
            revert("like failed for you are in blacklist because you got too much unlikes!");
        }

        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        if (_tokenInfos[tokenId].addressStatus[msg.sender] == 1){
            _tokenInfos[tokenId].tokenHates--;
        }         

        if(_tokenInfos[tokenId].addressStatus[msg.sender] != 2){
            _tokenInfos[tokenId].addressStatus[msg.sender] = 2;
            _tokenInfos[tokenId].tokenLikes++;
        }      

        return true;
    }

    function rewardNft(uint256 tokenId) public payable returns (bool){
        if(super.ownerOf(tokenId) == address(0x0)){
            return false;
        }

        _tokenInfos[tokenId].tokenRewards += msg.value;        
    }

    function claim() public payable returns (bool){
        if(isAddressForbidded()){
            revert("claim failed for you are in blacklist because you got too much unlikes!");
        }  

        uint256 balance = super.balanceOf(msg.sender);
        uint256 rewards = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = super.tokenOfOwnerByIndex(msg.sender, i);
            rewards += _tokenInfos[tokenId].tokenRewards;
            _tokenInfos[tokenId].tokenRewards = 0;
        }

        if(rewards > 0 && address(this).balance > rewards){
            payable(msg.sender).transfer(rewards);
        }

        return true;
    }

    function getNftInfoByIndex(uint256 tokenId) public view returns (address, string memory, string memory, uint, uint, uint256, uint256){
        return (
            super.ownerOf(tokenId), 
            super.tokenURI(tokenId), 
            _tokenInfos[tokenId].tokenType, 
            _tokenInfos[tokenId].tokenLikes,
            _tokenInfos[tokenId].tokenHates,
            _tokenInfos[tokenId].tokenRewards, 
            _tokenInfos[tokenId].tokenPrices
        );
    }

    function minted(string memory tokenURI) public view returns (bool){
        return _tokenUri[tokenURI];
    }

    function addVote(string memory title, string memory content, uint value, uint deadline) public returns (bool){
        if(isAddressForbidded()){
            revert("add vote failed for you are in blacklist because you got too much unlikes!");
        }

        if(super.balanceOf(msg.sender) == 0){
            revert("add vote failed for you have not own any NFTs of this project!");
        }  

        if(bytes(title).length == 0 || bytes(content).length == 0){
            revert("vote title or content is empty!");
        }

        if(deadline < 1 || deadline > 30){
            revert("vote deadline must between 1-30 days from now!");
        }

        if(_addressVoteCreated[msg.sender] > _maxUserVotes){
            revert("add vote failed for you have reached the max creatable votes number!");
        }

        if(isStringEqual(title, "ChangeMaxTotalSupply") && (value < 10000 || value > 20000)){
            revert("add vote failed for max total supply must between 10000 and 20000!");
        }else if(isStringEqual(title, "ChangeMaxUserSupply") && (value < 1 || value > 10)){
            revert("add vote failed for max user supply must between 1 and 10!");
        }else if(isStringEqual(title, "ChangeMaxUserHates") && (value < 1000 || value > 5000)){
            revert("add vote failed for max user hates must between 1000 and 5000!");
        }else if(isStringEqual(title, "ChangeMinVoteAggrees") && (value < 5000 || value > 10000)){
            revert("add vote failed for min vote aggress must between 5000 and 10000!");
        }else if(isStringEqual(title, "ChangeMaxUserVotes") && (value < 1 || value > 5)){
            revert("add vote failed for max user create votes must between 1 and 5!");    
        }                           

        _voteId.increment();
        uint256 newVoteId = _voteId.current();

        if(_voteCount < _voteInfos.length){
            _voteInfos[_voteCount] = VoteInfo({
                voteId: newVoteId,
                voteOwner: msg.sender, 
                voteTitle: title, 
                voteContent: content, 
                voteAggree: 0, 
                voteDeadline: block.timestamp + deadline*24*3600, 
                voteValue: value, 
                voteSuccess: false
            });

        } else {
            _voteInfos.push(VoteInfo({
                voteId: newVoteId,
                voteOwner: msg.sender, 
                voteTitle: title, 
                voteContent: content, 
                voteAggree: 0, 
                voteDeadline: block.timestamp + deadline*24*3600, 
                voteValue: value, 
                voteSuccess: false
            }));
        }

        _voteCount++;
        _addressVoteCreated[msg.sender]++;
        return true;
    }

    function delVote(uint256 voteId) public returns (bool){
        for(uint i = 0; i < _voteCount; i++){
            if(_voteInfos[i].voteId != voteId){
                continue;
            }

            if(_voteInfos[i].voteOwner != msg.sender){
                revert("delete vote failed for you are not the owner of this vote!");
            }

            _voteCount--;
            _addressVoteCreated[msg.sender]--;
            
            _voteInfos[i] = _voteInfos[_voteCount];

            delete _voteInfos[_voteCount];
            return true;
        }

        return false;
    }

    function vote(uint256 voteId, bool voteAggree) public returns (bool){
        if(isAddressForbidded()){
            revert("vote failed for you are in blacklist because you got too much unlikes!");
        } 

        uint256 userCount = super.balanceOf(msg.sender);

        if(userCount == 0){
            revert("vote failed for you have not own any NFTs of this project!");
        } 

        for(uint i = 0; i < _voteCount; i++){
            if(_voteInfos[i].voteId != voteId){
                continue;
            }

            if(block.timestamp > _voteInfos[i].voteDeadline){
                revert("vote failed for this vote has already finished!");
            }    

            if(voteAggree){
                if(_addressVoteStatus[voteId][msg.sender] == 0){
                    _voteInfos[i].voteAggree += userCount;
                    _addressVoteStatus[voteId][msg.sender] = 1;
                }
            }else if(_addressVoteStatus[voteId][msg.sender] == 1){
                if(_voteInfos[i].voteAggree > userCount){
                    _voteInfos[i].voteAggree -= userCount;
                }else{
                    _voteInfos[i].voteAggree = 0;
                }
                
                _addressVoteStatus[voteId][msg.sender] = 0;
            }                

            return executeVote(i);
        }

        return false;
    }

    function getVoteTotal() public view returns (uint){
        return _voteCount;
    }

    function getVoteInfoByIndex(uint index) public view returns (uint256, address, string memory, string memory, uint, uint, uint, bool){
        VoteInfo memory v = _voteInfos[index];

        return (
            v.voteId, 
            v.voteOwner, 
            v.voteTitle, 
            v.voteContent, 
            v.voteAggree, 
            v.voteValue, 
            v.voteDeadline, 
            v.voteSuccess
        );
    }

    function sellNFT(uint256 tokenId, uint256 tokenPrice) public returns (bool){
        if(isAddressForbidded()){
            revert("sell failed for you are in blacklist because you got too much unlikes!");
        } 

        if(super.ownerOf(tokenId) != msg.sender){
            revert("sell failed for you are not the owner of this NFT!");
        }

        if(tokenPrice > 0 ){
            super.approve(address(this), tokenId);
        }

        _tokenInfos[tokenId].tokenPrices = tokenPrice;

        return true;
    }

    function buyNFT(uint256 tokenId) public payable returns (bool){
        address owner = super.ownerOf(tokenId);

        if(isAddressForbidded()){
            revert("buy failed for you are in blacklist because you got too much unlikes!");
        }     

        if(owner == msg.sender){
            revert("buy failed for you can not buy your own NFT!");
        }

        if(_tokenInfos[tokenId].tokenPrices <= 0){
            revert("buy failed for this NFT is not for sell!");
        }

        if(msg.value < _tokenInfos[tokenId].tokenPrices){
            revert("buy failed for the payment is not enough!");
        }

        ERC721(address(this)).safeTransferFrom(owner, msg.sender, tokenId);

        payable(owner).transfer(msg.value);

        _tokenInfos[tokenId].tokenPrices = 0;

        return true;
    }

    function getNFTPrameters() public view returns (uint, uint, uint, uint, uint){
        return (
            _maxTotalSupply, 
            _maxUserSupply, 
            _maxUserHates, 
            _maxUserVotes, 
            _minVoteAggrees
        );
    }

    function getAddressPrameters() public view returns (uint256, uint256, uint, uint256, bool){
        uint256 balance = super.balanceOf(msg.sender);
        uint256 rewards = 0;

        for(uint i = 0; i < balance; i++){
            uint256 tokenId = super.tokenOfOwnerByIndex(msg.sender, i);
            rewards += _tokenInfos[tokenId].tokenRewards;         
        }             

        return (
            super.totalSupply(), 
            balance, 
            _addressVoteCreated[msg.sender], 
            rewards, 
            isAddressForbidded()
        );
    }
}