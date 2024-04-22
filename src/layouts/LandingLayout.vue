<script setup lang="ts">
import MainSidebar from "@/components/navigation/MainSidebar.vue";
import MainAppbar from "@/components/toolbar/MainAppbar.vue";
// import GlobalLoading from "@/components/GlobalLoading.vue";
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar -->
  <!-- ---------------------------------------------- -->
  <MainSidebar />
  <!-- ---------------------------------------------- -->
  <!---Top AppBar -->
  <!-- ---------------------------------------------- -->
  <MainAppbar />
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->

  <v-main
    class="main-container"
  >
    <!-- <GlobalLoading /> -->
    <div class="flex-fill pa-5">
      <slot></slot>
    </div>
  </v-main>
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}
.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
