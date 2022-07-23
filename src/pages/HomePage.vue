<template>
  <FilesPage v-if="activeIndex==='1'" />
  <FoldersPage v-if="activeIndex==='2'"/>
  <WebsitesPage v-if="activeIndex==='3'"/>
  <NftsPage v-if="activeIndex==='4'"/>
  <VotesPage v-if="activeIndex==='5'"/>  
</template>

<script lang="ts">
import FilesPage from './FilesPage.vue';
import FoldersPage from './FoldersPage.vue';
import WebsitesPage from './WebsitesPage.vue';
import NftsPage from './NftsPage.vue';
import VotesPage from './VotesPage.vue';

export default {
  name: 'HomePage',
  props: {
    msg: String
  }
}
</script>

<script setup lang="ts">
import { connectState } from "../libs/connect"

const activeIndex = connectState.activeIndex;
</script>