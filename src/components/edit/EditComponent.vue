<template>
  <div class="p-4">
    <textarea
      v-model="yamlContent"
      rows="20"
      class="w-full border p-2 font-mono text-sm"
    ></textarea>
    <div class="flex justify-end mt-4">
      <v-btn @click="saveYaml" color="primary" class="ma-2 pa-2"> Save </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const yamlContent = ref("");
const LoadEditUrl = "http://" + location.hostname + ":8456/load-yaml";
const SaveEditUrl = "http://" + location.hostname + ":8456/save-yaml";

onMounted(async () => {
  try {
    const res = await axios.get(LoadEditUrl);
    yamlContent.value = res.data.content;
  } catch (err) {
    toast.error("Error during docker-compose.yml file loading");
    console.error(err);
  }
});

const saveYaml = async () => {
  try {
    await axios.post(SaveEditUrl, {
      content: yamlContent.value,
    });
    toast.success("Saved successfully!");
  } catch (err) {
    toast.error("Can't save docker-compose.yml file");
    console.error(err);
  }
};
</script>
