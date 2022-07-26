import { Web3Storage } from 'web3.storage'
import CryptoJS from 'crypto-js';

import * as path from "path"

import { connectState } from './connect'
import { getLocalStorage } from './localstorage'
import * as constant from "../constant"

//get web3 storage client
const getClient = () => {
  const key = `${connectState.userAddr.value.toLowerCase()}_web3storage_apikey`;

  const apiToken = getLocalStorage(key);

  if(connectState.web3Storage === undefined || 
    connectState.web3Storage === null || 
    connectState.web3Storage === ''){

    connectState.web3Storage = (apiToken === null || apiToken === '') ? constant.web3StorageAppKey : apiToken;
  }

  // Construct with token and endpoint
  const client = new Web3Storage({ token: connectState.web3Storage, endpoint: new URL(constant.web3StorageHost) });

  return client;
}
//upload file
export const uploadFile = async (file: any) => {
  return await uploadFolder(file.name, [file]);
}

//upload folder
export const uploadFolder = async (dirPath: string, files: any[]) => {
  const client = getClient();

  const data = [];

  if(files.length === 1 && ((files[0].raw) as any).webkitRelativePath === ''){
    data.push(files[0].raw);
  }else{
    for(const i in files){
      const file = files[i].raw;
      const relpath = (file as any).webkitRelativePath.split(path.sep).slice(1,).join(path.sep);
      data.push(new File([file], relpath));
    }
  }

  const md5sum = CryptoJS.MD5(`${dirPath}.${(new Date()).getTime()}`).toString();

  return await client.put(data, {
    name: md5sum,
    maxRetries: 3,
  });
}

//list dirs from the filcoin
export const listDirs = async(cid:string, dir:string = '') => {
  const dirList = new Array();

  const url = `${constant.ipfsHost}/api/v0/ls?arg=${cid}/${dir}`;

  try{
    let res = await fetch(url, {
      "referrer": (window as any).location.href,
      "referrerPolicy": "no-referrer-when-downgrade",
      "method": "GET",
      "credentials": "omit",
      "redirect": "follow",
    });  

    if (res.status >= 200 && res.status <= 299){
      res = await res.json();
      const links = (res as any).Objects[0]?.Links;
      for(const i in links){
        dirList.push({
          fileName: links[i]?.Name,
          fileSize: links[i]?.Size,
          isFolder: links[i]?.Type === 1,
        });
      }
    }
  }catch(e){
    return dirList;
  }

  return dirList;
}