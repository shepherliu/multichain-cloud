<template>
	<h4>Buy Cryptos @<el-image :src="transak" style="height: 25px;" @click="onClickTransak"/></h4>
	<el-drawer v-model="buyCrypto" direction="rtl" destroy-on-close @open="onTransakOpen">
      <template #default>
        <embed type="text/html" :src="transakUrl" style="height:100%;width: 100%;" />		
      </template>  
	</el-drawer>	
</template>

<script lang="ts">
export default {
  name: 'FootPage',
  props: {
  }
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import * as constant from "../constant"
import * as connect from "../libs/connect"

const transak = require('@/assets/transak.png');	
const buyCrypto = ref(false);
const transakUrl = ref(constant.transakUrl);

const onClickTransak = async () => {
	buyCrypto.value = true;
}

const onTransakOpen = async () => {
	if (connect.connectState.userAddr === ''){
		transakUrl.value = constant.transakUrl;
	} else {
		transakUrl.value = constant.transakUrl + '&disableWalletAddressForm=true&walletAddress=' + connect.connectState.userAddr;
	}
}
</script>