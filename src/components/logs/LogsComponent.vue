<template>
  <div>
    <ul class="console">
      <li
        v-for="(item, index) in lines"
        :key="index"
        v-html="formatLogs(item.data)"
      ></li>
    </ul>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref, onMounted, onBeforeUnmount } from "vue";
import "vue3-toastify/dist/index.css";

const LogsUrl = "http://" + location.hostname + ":8456/logs";

export default {
  setup() {
    const lines = ref([]);

    const fetchLines = async () => {
      try {
        const response = await axios.get(LogsUrl);
        lines.value = response.data;
      } catch (error) {
        console.error("GET error:", error);
      }
    };

    onMounted(() => {
      fetchLines();
    });

    onBeforeUnmount(() => {
      lines.value = []; // reset previous variables
    });

    const formatLogs = (logString: string) => {
      logString = logString.replace(/;1m/g, "m");
      return (
        logString.replace(/\u001b\[(\d+)m/g, (_, colorCode) => {
          switch (colorCode) {
            case "30":
              return '<span style="color: black;">';
            case "31":
              return '<span style="color: red;">';
            case "32":
              return '<span style="color: green;">';
            case "33":
              return '<span style="color: yellow;">';
            case "34":
              return '<span style="color: blue;">';
            case "35":
              return '<span style="color: magenta;">';
            case "36":
              return '<span style="color: cyan;">';
            case "37":
              return '<span style="color: white;">';
            default:
              return "<span>";
          }
        }) + "</span>"
      );
    };

    return { lines, formatLogs };
  },
};
</script>

<style scoped>
.console {
  background-color: black;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: "Courier New", Courier, monospace;
  overflow-y: scroll;
  max-height: 1000px;
}
</style>
