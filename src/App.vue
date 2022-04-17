<template>
  <el-container>
    <el-header><NavBar /></el-header>
    <el-container>
      <el-main><HomePage /></el-main>
      <el-aside width="300px">
        <UploadFile />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import NavBar from './components/NavBar.vue';
import UploadFile from './components/UploadFile.vue';
import HomePage from './pages/HomePage.vue';

@Options({
  components: {
    NavBar,
    HomePage,
    UploadFile,
  },
})
export default class App extends Vue {}
</script>