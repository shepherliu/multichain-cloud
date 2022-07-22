//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

enum FileType {
    IMAGE,
    AUDIO,
    VIDEO,
    DOCS,
    FOLDER,
    WEBSITE
}

struct FileInfo {
    string fileName;
    string fileId;
    FileType fileType;
    uint fileSize;
    bool isEncrypt;
}  

contract FileManager is ERC721Enumerable {
    using Counters for Counters.Counter;

    address private _owner;

    Counters.Counter private _fileId;

    mapping(uint256 => FileInfo) private _fileInfos;

    mapping(address => mapping(string => bool)) _fileNames;

    constructor() ERC721("FileManager", "FM") {
        _owner = msg.sender;
    }     

    function addFile(string memory fileName, string memory fileId, FileType fileType,  uint fileSize, bool isEncrypt) public returns (uint256){
        require(bytes(fileName).length > 0, "invalid name!");
        require(bytes(fileId).length > 0, "invalid id!");
        require(_fileNames[msg.sender][fileName] == false, "name exists!");

       _fileNames[msg.sender][fileName] = true;
        
        _fileId.increment();

        uint256 newId = _fileId.current();

        _mint(msg.sender, newId);

        _fileInfos[newId] = FileInfo({
            fileName: fileName,
            fileId: fileId,
            fileType: fileType,
            fileSize: fileSize,
            isEncrypt: isEncrypt
        });

        return newId;
    }

    function delFile(uint256 fileId) public returns (bool){
        require(ownerOf(fileId) == msg.sender, "only owner support!");

        _fileNames[msg.sender][_fileInfos[fileId].fileName] = false;

        delete _fileInfos[fileId];

        _burn(fileId);

        return true;
    }

    function checkFile(string memory fileName) public view returns (bool){
        return _fileNames[msg.sender][fileName];
    }

    function getIndexsByFileType(FileType fileType) public view returns(uint256[] memory){
        uint total = balanceOf(msg.sender);
        uint count;
        uint256 fileId;
        uint256[] memory indexList;

        if(total == 0){
            return indexList;
        }

        uint256[] memory tmpList = new uint256[](total);

        for(uint i = 0; i < total; i++){
            
            fileId = tokenOfOwnerByIndex(msg.sender, i);

            if(_fileInfos[fileId].fileType == fileType){
                tmpList[count++] = fileId;
            }
        }

        if(count > 0){
            indexList = new uint256[](count);
            for(uint i = 0; i < count; count++){
                indexList[i] = tmpList[i];
            }
        }

        return indexList;
    }

    function getFileInfoByIndex(uint256 fileId) public view returns (FileInfo memory){
        if (ownerOf(fileId) == msg.sender){
            return _fileInfos[fileId];
        }else{
            return _fileInfos[0];
        }
    }
}

