//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//vote type
enum VoteType {
    ApplyForVote,
    ApplyForTreassure,
    ChangeMaxTotalSupply,
    ChangeMaxUserSupply,
    ChangeMaxUserHates,
    ChangeMinUserAggrees,
    ChangeMaxUserVotes
}

//vote status for user
enum VoteStatus {
    None, //not vote
    Aggree, //vote aggree
    Against //vote against
}

//vote info
struct VoteInfo {
    string voteName; //vote name
    string voteDesc; //vote detail
    VoteType voteType; //vote type
    uint256 voteValue; //vote value if apply for payment
    address voteToken; //vote token contract address if apply for payment
    address voteTo; //address to transfer if apply for payment
    uint voteAggree; //vote aggree count
    uint voteAgainst; //vote against count
    uint endTime; //vote end time
    bool voteSuccess; //vote success or failed
    bool votePayed; //vote payed or not
}

//web3 nft interface
interface Web3NFT {
    function updateMaxTotalSupply(uint max) external;
    function updateMaxUserSupply(uint max) external;
    function updateMaxUserHates(uint max) external;
    function isAddressForbidded(address user) external view returns (bool);
}

//web3 vote contract
contract Web3Vote is ERC721Enumerable, ReentrancyGuard {  
    using Counters for Counters.Counter;

    //vote id
    Counters.Counter private _voteId;

    //vote infos
    mapping(uint256 => VoteInfo) private _voteInfos;

    //contract owner
    address private _owner;

    //dao contract
    address private _daoContract;

    //min user aggress that vote can pass
    uint private _minUserAggrees;

    //max votes that user can create
    uint private _maxUserVotes;

    //vote status
    mapping(uint256 => mapping(address => VoteStatus)) private _voteStatus;

    //init owner address and dao address
    constructor() ERC721("WEB3Vote", "WVOTE") {
        _minUserAggrees = 5000;
        _maxUserVotes = 5;
        _owner = msg.sender;
    }

    //update contracts address, only owner support
    function updateContracts(address dao) public {
        require(msg.sender == _owner);

        _daoContract = dao;
    }

    //send dao treassure when vote success
    function _sendDaoTreassure(uint256 voteId, address to, address token, uint256 amount) internal returns (bool){
        require(_voteInfos[voteId].voteSuccess == true, "vote not success!");     

        if(token == address(0x0)){
            require(address(this).balance > amount, "invalid amount!");   
            payable(to).transfer(amount);
        }else{
            require(ERC20(token).balanceOf(address(this)) > amount, "invalid amount!");
            ERC20(token).transferFrom(address(this), to, amount);
        }

        return true;
    }    

    //mint a nft as a new vote
    function mint(string memory name, string memory desc, VoteType voteType, uint256 value, address token, address to, uint endTime) public returns (uint256){
        //msg.sender not banned
        require(Web3NFT(_daoContract).isAddressForbidded(msg.sender) == false, "user banned!");

        //check user supply
        require(balanceOf(msg.sender) < _maxUserVotes, "reaching user max votes!");

        _voteId.increment();

        uint256 newId = _voteId.current();

        //mint a nft as a new vote
        _mint(msg.sender, newId);

        //set vote value for transfer after success
        _voteInfos[newId].voteValue = value;
        //set vote token contract for transfer after success
        _voteInfos[newId].voteToken = token;
        //set value transfer to address
        _voteInfos[newId].voteTo = to;
        //set vote type
        _voteInfos[newId].voteType = voteType;

        //update vote info
        updateVote(newId, name, desc, endTime);

        return newId;
    }    

    //burn the vote
    function burn(uint256 voteId) public returns (bool) {
        require(ownerOf(voteId) == msg.sender, "only owner alowed!");

        require(_voteInfos[voteId].endTime > block.timestamp && _voteInfos[voteId].votePayed == false, "vote ended!");

        //delete grant info
        delete _voteInfos[voteId];
        //burn token
        _burn(voteId);

        return true;
    }           

    //update vote infos
    function updateVote(uint256 voteId, string memory name, string memory desc, uint endTime) public returns (bool){
        require(ownerOf(voteId) == msg.sender, "only owner alowed!");

        require(bytes(name).length > 0, "invalid vote name!");

        require(endTime >= block.timestamp + 86400, "invalid end time!");

        _voteInfos[voteId].voteName = name;

        if(bytes(desc).length > 0){
            _voteInfos[voteId].voteDesc = desc;
        }

        _voteInfos[voteId].endTime = endTime;

        return true;
    }

    //vote for the dao members
    function vote(uint256 voteId, VoteStatus status) public nonReentrant returns (bool){
        require(_voteInfos[voteId].endTime >= block.timestamp && _voteInfos[voteId].votePayed == false, "vote ended!");

         //msg.sender not banned
        require(Web3NFT(_daoContract).isAddressForbidded(msg.sender) == false, "user banned!");

        VoteStatus old = _voteStatus[voteId][msg.sender];

        //set new status
        _voteStatus[voteId][msg.sender] = status;

        //votes of one user
        uint balance = ERC721(_daoContract).balanceOf(msg.sender);

        //update aggree and against count
        if(old == VoteStatus.Aggree){
            if(status == VoteStatus.Aggree){
                return true;
            }else if (status == VoteStatus.Against){
                if(_voteInfos[voteId].voteAggree > balance){
                    _voteInfos[voteId].voteAggree -= balance;
                }else{
                    _voteInfos[voteId].voteAggree = 0;
                }
                
                _voteInfos[voteId].voteAgainst += balance;
            }else{
                if(_voteInfos[voteId].voteAggree > balance){
                    _voteInfos[voteId].voteAggree -=balance;
                }else{
                    _voteInfos[voteId].voteAggree = 0;
                }
            }
        }else if(old == VoteStatus.Against){
            if(status == VoteStatus.Aggree){
                _voteInfos[voteId].voteAggree += balance;
                if(_voteInfos[voteId].voteAgainst > balance){
                    _voteInfos[voteId].voteAgainst -= balance;
                }else{
                    _voteInfos[voteId].voteAgainst = 0;
                }
            }else if (status == VoteStatus.Against){
                return true;
            }else{
                if(_voteInfos[voteId].voteAgainst > balance){
                    _voteInfos[voteId].voteAgainst -= balance;
                }else{
                    _voteInfos[voteId].voteAgainst = 0;
                }
            }
        }else{
            //default None
            if(status == VoteStatus.Aggree){
                _voteInfos[voteId].voteAggree += balance;
            }else if (status == VoteStatus.Against){
                _voteInfos[voteId].voteAgainst += balance;
            }else{
                return true;
            }            
        }

        //get total member for dao
        uint total = ERC721Enumerable(_daoContract).totalSupply();

        //failed if against > 40% of total member
        if(_voteInfos[voteId].voteAgainst > total * 4 / 10){
            _voteInfos[voteId].voteSuccess = false;
            return true;
        }

        //success if aggree > 50% of total member
        if(_voteInfos[voteId].voteAggree >= _minUserAggrees && _voteInfos[voteId].voteAggree > total / 2){
            uint256 amount = _voteInfos[voteId].voteValue;
            _voteInfos[voteId].votePayed = true;
            _voteInfos[voteId].voteSuccess = true;
            if(amount == 0){
                return true;
            }

            //execute vote based on the type
            VoteType t = _voteInfos[voteId].voteType;

            if(t == VoteType.ApplyForTreassure){
                _sendDaoTreassure(voteId, _voteInfos[voteId].voteTo, _voteInfos[voteId].voteToken, amount);
            }else if(t == VoteType.ChangeMaxTotalSupply){
                Web3NFT(_daoContract).updateMaxTotalSupply(amount);
            }else if(t == VoteType.ChangeMaxUserSupply){
                Web3NFT(_daoContract).updateMaxUserSupply(amount);
            }else if(t == VoteType.ChangeMaxUserHates){
                Web3NFT(_daoContract).updateMaxUserHates(amount);
            }else if(t == VoteType.ChangeMinUserAggrees){
                require(amount >= 5000 && amount <= 15000);
                _minUserAggrees = amount;
            }else if(t == VoteType.ChangeMaxUserVotes){
                require(amount >= 1 && amount <= 10);
                _maxUserVotes = amount;
            }
        }

        return true;
    }

    //get vote total count
    function getVoteTotalCount(bool onlyOwner) public view returns(uint){
        if(onlyOwner){
            return balanceOf(msg.sender);
        }else{
            return totalSupply();
        }        
    }      

    //get vote info by id
    function getVoteInfoById(uint256 voteId) public view returns (VoteInfo memory){
        return _voteInfos[voteId];
    }

    //get vote indexs by page
    function getVoteIndexsByPageCount(uint pageSize, uint pageCount, bool onlyOwner) public view returns(uint256[] memory){
        uint total = getVoteTotalCount(onlyOwner);
        uint256[] memory indexList;
        uint count;
        uint m;
        uint256 index;

        if(pageSize > 100){
            pageSize = 100;
        }

        uint start = pageSize*pageCount;
        uint end = start+pageSize;

        uint256[] memory tmpList = new uint256[](pageSize);   

        for(uint i = 0; i < total; i++){
           if(onlyOwner){
                index = tokenOfOwnerByIndex(msg.sender, total - i - 1);
            }else{
                index = tokenByIndex(total -i - 1);
            }

            count++;

            if(count < start){
                continue;
            }else if (count > end){
                break;
            }else{
                tmpList[m++] = index;
            }
        }

        if(m > 0){
            indexList = new uint256[](m);
            for(uint i = 0; i < m; i++){
                indexList[i] = tmpList[i];
            }
        }

        return indexList;
    }
}