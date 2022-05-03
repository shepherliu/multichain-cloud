<template>
  <FilesPage v-if="store.state.activeIndex===1" />
  <FoldersPage v-if="store.state.activeIndex===2"/>
  <WebsitesPage v-if="store.state.activeIndex===3"/>
  <NftsPage v-if="store.state.activeIndex===4"/>
</template>

<script lang="ts">
import FilesPage from './FilesPage.vue';
import FoldersPage from './FoldersPage.vue';
import WebsitesPage from './WebsitesPage.vue';
import NftsPage from './NftsPage.vue';

export default {
  name: 'HomePage',
  props: {
    msg: String
  }
}
</script>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore();

</script>