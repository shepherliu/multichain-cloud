import * as path from "path"

import { Tar } from './tar'

import { fileType } from "./tools"
import * as constant from "../constant"

// fetch file from swarm by hash
export const getFileFromSwarm = async (hash: string, name = '') => {
  const res = await fetch(`${constant.swarmGateway}${hash}/${name}`, {
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": (window as any).location.href,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  });

  return await res.text();
}

//upload ts-tar files collection to swarm and return the file reference
//try every swarm gateway until it success, because swarm is not so stable now.

export const uploadDataToSwarm = async (data: Uint8Array, index:string = '') => {
  for(let i = 0; i < constant.swarmGatewayList.length; i++){
    try {

      const res = await fetch(constant.swarmGatewayList[i], {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/x-tar",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "swarm-collection": "true",
          "swarm-index-document": index,
          "swarm-postage-batch-id": "0000000000000000000000000000000000000000000000000000000000000000"
        },
        "referrer": (window as any).location.href,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": data,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });

      return ((await res.json()) as any).reference;

    } catch(e){
      continue;
    }
  }

  return null;
}

//upload file
export const uploadFile = async (file: any) => {
  return await uploadFolder(file.name, [file]);
}

//upload folder
export const uploadFolder = async (dirPath: string, files: any[]) => {
 const tar = new Tar();

 const metadata = {name: "", size: 0, type:"", path: new Array()};

 if (files.length === 0){
    throw new Error(`no files selected to upload!`); 
 }

 const callback = (output:Uint8Array) => {};

 //js tar the files
 for(const i in files){
    const type = fileType(files[i].name);

    const relpath = ((files[i].raw) as any).webkitRelativePath.split(path.sep).slice(1,).join(path.sep);

    const data = await files[i].raw.arrayBuffer();

    metadata.size += files[i].raw.size;
    metadata.path.push(relpath);

    if(files.length === 1 && ((files[0].raw) as any).webkitRelativePath === '') {
      metadata.name = files[i].name;
      metadata.type = type;
      tar.append(files[i].name, new Uint8Array(data), {}, callback);
    } else if (relpath === 'index.html'){
      metadata.name = 'website';
      tar.append(relpath, new Uint8Array(data), {}, callback);
    }else{
      tar.append(relpath, new Uint8Array(data), {}, callback);
    }
 }

 let indexDocuemnt = '';

 if(metadata.name === ''){
  metadata.name = dirPath;
 }else if(metadata.name === 'website'){
  indexDocuemnt = 'index.html';
 }else{
  indexDocuemnt = files[0].raw?.name;
 }

 //add meta file
 tar.append(constant.META_FILE_NAME, JSON.stringify(metadata), {}, callback);

 return await uploadDataToSwarm(tar.out, indexDocuemnt);
}

//list dirs from the filcoin
export const listDirs = async(cid:string, dir:string = '') => {
  const dirList = new Array();
  const dirMap = Object();

  try{
    const res = await getFileFromSwarm(cid, constant.META_FILE_NAME);

    const pathList = JSON.parse(res)?.path;

    const depth = dir === '' ? 1 : dir.split("/").length + 1;

    for(const i in pathList){
      if(dir != pathList[i].split("/").slice(0, depth-1).join("/")){
        continue;
      }else if(pathList[i].split("/").length === depth){
        const name = path.basename(pathList[i]);

        if(dirMap[name]){
          continue;
        }else{
          dirMap[name] = true;
        }

        dirList.push({
          fileName: name,
          fileSize: 0,
          isFolder: false,
        })
      }else{
        const name = pathList[i].split("/")[depth-1];
        
        if(dirMap[name]){
          continue;
        }else{
          dirMap[name] = true;
        }

        dirList.push({
          fileName: name,
          fileSize: 0,
          isFolder: true,
        })
      }
    }
  }catch(e){
    return dirList;
  }

  return dirList;
}