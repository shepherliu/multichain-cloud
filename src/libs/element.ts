import { h } from "vue"

import { ElMessage } from 'element-plus'

//trigger an el-message
export const elMessage = async (msgtype:any, msginfo: any) => {
	ElMessage({
          duration: 1000,
          showClose: true,
          offset: 45,
          type: msgtype,
          message: h('i', { style: 'color: teal' }, msginfo),
    });
}