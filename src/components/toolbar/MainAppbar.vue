<!--
* @Component:
* @Maintainer: Pierrick Curt
* @Description:
-->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import ThemeToggle from "./ThemeToggle.vue";
const customizeTheme = useCustomizeThemeStore();
import { useVersionStore } from "@/stores/version";
const versionStore = useVersionStore();
onMounted(() => versionStore.refresh());
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!--App Bar -->
  <!-- ---------------------------------------------- -->
  <v-app-bar>
    <!-- ---------------------------------------------- -->
    <!-- NavIcon -->
    <!-- ---------------------------------------------- -->
    <v-app-bar-nav-icon
      @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"
    ></v-app-bar-nav-icon>
    <div class="px-2 d-flex align-center justify-space-between w-100">
      <h4 class="logo-text">
        <span>{{ versionStore.os_version }}</span>
      </h4>
    </div>
    <div class="px-2 d-flex align-center justify-space-between w-100">
      <v-spacer></v-spacer>
      <div class="d-flex">
        <ThemeToggle />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
