import * as path from "path"

import * as swarm from './swarm'
import * as bundlr from './bundlr'
import * as web3storage from './web3storage'
import * as crypto from './crypto'


import { connectState } from './connect'
import * as tools from "./tools"
import * as filemanager from "./filemanager"

import * as constant from "../constant"

//get real file url link based on the storage type
const getFileLink = (filename:string, filetype:string, fileid:string) => {
  if(fileid === undefined || fileid === null || fileid === ''){
    return '';
  }
    
  switch(connectState.storage){
    case 'bundlr':
      if(filetype==='folder'){
        return `${constant.arweaveUrl}${fileid}`;
      }else if (filetype==='website'){
        return `${constant.arweaveUrl}${fileid}/index.html`;
      }else{
        return `${constant.arweaveUrl}${fileid}`;
      }      
    case 'swarm':
      if(filetype==='folder'){
        return `${constant.swarmGateway}${fileid}`;
      }else if (filetype==='website'){
        return `${constant.swarmGateway}${fileid}/index.html`;
      }else{
        return `${constant.swarmGateway}${fileid}/${filename}`;
      }
    case 'filcoin':
      if(filetype==='folder'){
        return `https://${fileid}.ipfs.dweb.link`;
      } else if (filetype==='website'){
        return `https://${fileid}.ipfs.dweb.link/index.html`;
      } else {
        return `https://${fileid}.ipfs.dweb.link/${filename}`;
      }
  }

  return fileid;
}

//upload file
export const uploadFile = async (file: any, isEncrypt:boolean = false) => {
  return await uploadFolder(file.name, [file], isEncrypt);
}

//upload folder
export const uploadFolder = async (dirPath: string, files: any[], isEncrypt:boolean = false) => {
  if(files.length===0){
    throw new Error("no files selected to upload!");
  }

  if(await filemanager.checkFile(dirPath)){
    throw new Error("file/folder already exists!");
  }

  let size = 0;
  for(const i in files){
    size += (files[i].raw as any).size;
  }

  let filetype = '';
  if(files.length === 1 && ((files[0].raw) as any).webkitRelativePath === ''){
    filetype = tools.fileType(files[0].name).split('/')[0];
    if(filetype!='image'&&filetype!='audio'&&filetype!='video'){
      filetype = 'docs';
    }
  }else{
    filetype = 'folder';
    for(const i in files){
      const relpath = ((files[i].raw) as any).webkitRelativePath.split(path.sep).slice(1,).join(path.sep);
      if(relpath==='index.html'){
        filetype = 'website';
        break;
      }
    }
  }

  if(isEncrypt && filetype != 'website'){
    const password = crypto.generateRandom256Bits();
    const sign_data = await crypto.encryptPasswordWithWallet(password);

    for (const i in files){
      const webkitRelativePath = files[i].raw?.webkitRelativePath;

      const encrypt_data = await crypto.encryptDataWithCryptoJs(await files[i].raw?.arrayBuffer(), password);

      const file_data = {
        ...sign_data,
        encrypt_data: encrypt_data,
      };

      files[i] = tools.makeFileObject(files[i].name, JSON.stringify(file_data), files[i].type, webkitRelativePath);
    }
  }

  //upload to the remote storage
  let fileid = '';
  switch (connectState.storage){
    case 'bundlr':
      fileid = await bundlr.uploadFolder(dirPath, files);
      break;
    case 'swarm':
      fileid = await swarm.uploadFolder(dirPath, files);
      break;
    case 'filcoin':
      fileid = await web3storage.uploadFolder(dirPath, files);
      break;
    default:
      fileid = await web3storage.uploadFolder(dirPath, files);
      break;
  }   

  fileid = getFileLink(dirPath, filetype, fileid);

  //upload to the smart contract
  return await filemanager.addFile(dirPath, fileid, filetype, size, isEncrypt);
}

//list dir
export const listDirs = async(cid:string, dir:string = '') => {
  let res = new Array();

  let storageType = 'filcoin';

  if(cid.indexOf(".ipfs.dweb.link") >= 0){
    storageType = 'filcoin';
  }else if(cid.indexOf(constant.swarmGateway) === 0){
    storageType = 'swarm';
  }else if(cid.indexOf(constant.arweaveUrl) === 0){
    storageType = 'bundlr';
  }else{
    storageType = 'filcoin';
  }

  switch (storageType){
    case 'bundlr':
      cid = cid.replace(constant.arweaveUrl, "").split(".")[0];
      break;
    case 'swarm':
      cid = cid.replace(constant.swarmGateway, "").split(".")[0];
      res = await swarm.listDirs(cid, dir);
      break;
    case 'filcoin':
      cid = cid.replace("https://", "").split(".")[0];
      res = await web3storage.listDirs(cid, dir);
      break;
    default:
      cid = cid.replace("https://", "").split(".")[0];
      res = await web3storage.listDirs(cid, dir);
      break;
  }

  return res;
}