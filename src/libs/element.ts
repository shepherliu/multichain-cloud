import { h } from "vue"

import { ElMessage, ElMessageBox } from 'element-plus'

//trigger an el-message
export const elMessage = async (msgtype:any, msginfo: any, useHtml = false) => {
	ElMessage({
          duration: 5000,
          showClose: true,
          dangerouslyUseHTMLString: useHtml,
          offset: 45,
          type: msgtype,
          message: useHtml ? msginfo : h('i', { style: 'color: teal' }, msginfo),
    });
}

//trigger an el-message box
export const elMessageBox = async(desc:string, title:string, options: Object, callback:Function) => {
    ElMessageBox.prompt(desc, title, options).then(({ value }) => {
        callback(value);
    });
}

//trigger an error message
export const alertMessage = async(error: any) => {
    if( error.data != undefined && 
        error.data != null && 
        error.data.message != undefined && 
        error.data.message != null){

        elMessage('error', error.data.message); 
        return;
    }

    if( error.data != undefined && 
        error.data != null && 
        error.data.error != undefined && 
        error.data.error != null && 
        error.data.error.message != undefined && 
        error.data.error.message != null){

        elMessage('error', error.data.error.message); 
        return;
    }    

    if( error.data != undefined && 
        error.data != null && 
        error.data.error != undefined && 
        error.data.error != null){

        elMessage('error', error.data.error); 
        return;
    } 

    if( error.error != undefined && 
        error.error != null && 
        error.error.message != undefined &&
        error.error.message != null){

        elMessage('error', error.error.message); 
        return;
    }      

    if( error.error != undefined &&
        error.error != null) {

        elMessage('error', error.error);
        return;   
    }

    if( error.message != undefined && 
        error.message != null){
        
        try{
            elMessage('error', error.message);    
        }catch(e){
            if( error.reason != undefined && 
                error.reason != null){
                
                try{
                    elMessage('error', error.reason);    
                }catch(e){
                    if(error.stack.length > 300){
                        error.stack = error.stack.slice(0, 300);
                    }
                    elMessage('error', error.stack);
                }
            }
        }
    }
} 