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