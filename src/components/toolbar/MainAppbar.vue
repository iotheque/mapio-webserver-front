<!--
* @Component:
* @Maintainer: Pierrick Curt
* @Description:
-->
<script setup lang="ts">
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import ThemeToggle from "./ThemeToggle.vue";
const customizeTheme = useCustomizeThemeStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!--App Bar -->
  <!-- ---------------------------------------------- -->
  <v-app-bar>

    <div class="px-2 d-flex align-center justify-space-between w-100">
      <!-- ---------------------------------------------- -->
      <!-- NavIcon -->
      <!-- ---------------------------------------------- -->
      <v-app-bar-nav-icon
        @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div class="d-flex">
        <ThemeToggle />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
