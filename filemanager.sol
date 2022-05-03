//SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract FileManager {
    struct FileInfo {
        string fileName;
        string fileType;
        string fileId;
        uint256 fileSize;
    }    
    //owner
    address private owner;

    //store files info
    mapping(address => FileInfo[]) files;

    //store files name
    mapping(address => mapping(string => bool)) private names;

    //store files count
    mapping(address => uint256) counts;

    //store files id
    mapping(string => address) private ids;
    // set contract owner
    constructor() {
        owner = msg.sender;
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

    //add a file
    function addFile(string memory filename, string memory filetype, string memory fileid, uint256 filesize) public returns (bool){
        if(bytes(filename).length == 0){
            revert("file name is empty!");
        }

        if(bytes(fileid).length == 0){
            revert("file id is empty!");
        }

        if(filesize <= 0){
            revert("file size is zero!");
        }

        if(!isStringEqual(filetype, "image")&&
            !isStringEqual(filetype, "audio")&&
            !isStringEqual(filetype, "video")&&
            !isStringEqual(filetype, "docs")&&
            !isStringEqual(filetype, "folder")&&
            !isStringEqual(filetype, "website")){

            revert("unknow file type!");
        }
        
        if(ids[fileid] != address(0x0)){
            revert("file id already exists!");
        }

        if(names[msg.sender][filename]){
            revert("file name already exists!");
        }

        //save file id
        ids[fileid] = msg.sender;

        //save file name
        names[msg.sender][filename] = true;

        uint256 cnt = counts[msg.sender];

        //save to old index
        if(cnt < files[msg.sender].length){
            files[msg.sender][cnt].fileName = filename;
            files[msg.sender][cnt].fileType = filetype;
            files[msg.sender][cnt].fileId = fileid;
            files[msg.sender][cnt].fileSize = filesize;
            counts[msg.sender]++;
            return true;            
        }

        //push to new index
        FileInfo memory file;
        file.fileName = filename;
        file.fileType = filetype;
        file.fileId = fileid;
        file.fileSize = filesize;
        counts[msg.sender]++;    

        files[msg.sender].push(file);
        return true;
    }   

    //del a file
    function delFile(string memory fileid) public returns (bool){
        if(ids[fileid] != msg.sender) {
            revert("only owner can del this file!");
        }

        //del file id 
        ids[fileid] = address(0x0);

        for(uint i = 0; i < files[msg.sender].length; i++){
            if(isStringEqual(fileid, files[msg.sender][i].fileId)){
                names[msg.sender][files[msg.sender][i].fileName] = false;
                counts[msg.sender]--;
                uint256 cnt = counts[msg.sender];
                files[msg.sender][i] = files[msg.sender][cnt];
                files[msg.sender][cnt].fileName = "";
                files[msg.sender][cnt].fileType = "";
                files[msg.sender][cnt].fileId = "";
                files[msg.sender][cnt].fileSize = 0;   
                return true;
            }
        }

        return false;
    }

    //get file indexs list by filetype
    function getIndexsByFileType(string memory filetype) public view returns (uint256[] memory){
        uint256[] memory data;
        uint256 count = files[msg.sender].length;
        //zero file
        if(count == 0){
            return data;
        }        

        uint256[] memory indexs = new uint256[](files[msg.sender].length);
        uint256 total = files[msg.sender].length - 1;
        uint256 start = 0;

        //save indexs
        for(uint i = total; i >= 0; i--){
            if(isStringEqual(filetype, files[msg.sender][i].fileType)){
                start = i;
                indexs[i] = i;
            }else{
                count--;
            }

            if(i == 0){
                break;
            }
        }

        //zero file
        if(count == 0){
            return data;
        }          

        //rebuild array
        data = new uint256[](count);
        uint256 k = 0;
        for(uint i = start; i <= total; i++){
            if(indexs[i] == i){
                data[k]=i;
                k++;
            }
        }

        return data;
    }

    //get file info by index
    function getFileInfoByIndex(uint256 index) public view returns(string memory, string memory, string memory, uint256){
        if(index >= counts[msg.sender]){
            return ("", "", "", 0);
        }else{
            return (files[msg.sender][index].fileName, files[msg.sender][index].fileType, files[msg.sender][index].fileId, files[msg.sender][index].fileSize);
        }
    }  
}