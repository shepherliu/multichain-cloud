import * as swarm from './swarm'
import * as bundlr from './bundlr'

import { connectState } from './connect'

//upload file
export const uploadFile = async (file: any) => {
  switch (connectState.storage){
    case 'bundlr':
      return await bundlr.uploadFile(file);
    case 'swarm':
      return await swarm.uploadFile(file);
  }

  return await swarm.uploadFile(file); 
}

//upload folder
export const uploadFolder = async (dirPath: string, files: any[]) => {
  switch (connectState.storage){
    case 'bundlr':
      return await bundlr.uploadFolder(dirPath, files);
    case 'swarm':
      return await swarm.uploadFolder(dirPath, files);
  }	

  return await swarm.uploadFolder(dirPath, files);
}