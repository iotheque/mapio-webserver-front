<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useLogStream } from "@/composables/useLogStream";

const { lines, connected, start } = useLogStream();
const container = ref<HTMLElement | null>(null);

// The check runs before the DOM update, so only follow the logs if already at the bottom
watch(
  () => lines.value[lines.value.length - 1]?.id,
  async () => {
    const el = container.value;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    await nextTick();
    if (atBottom) el.scrollTop = el.scrollHeight;
  },
);

onMounted(start);
</script>

<template>
  <div>
    <div ref="container" class="console">
      <div v-for="line in lines" :key="line.id">
        <span
          v-for="(segment, index) in line.segments"
          :key="index"
          :style="segment.color ? { color: segment.color } : undefined"
          >{{ segment.text }}</span
        >
      </div>
      <div v-if="!connected" class="status">
        Connecting to the log stream...
      </div>
    </div>
  </div>
</template>

<style scoped>
.console {
  background-color: black;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  overflow-y: scroll;
  height: 70vh;
}

.status {
  color: #7f7f7f;
}
</style>
