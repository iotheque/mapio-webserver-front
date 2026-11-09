<!--
* @Component: 
* @Maintainer: Pierrick Curt
* @Description: 
-->
<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 500,
  },
});
</script>

<template>
  <img
    src="@/assets/images/404.svg"
    alt="404"
    :height="props.size"
    :width="props.size"
  />
</template>

<style scoped lang="scss"></style>
