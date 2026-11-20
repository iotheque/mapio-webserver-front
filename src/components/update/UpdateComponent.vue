<script setup lang="ts">
import { api } from "@/api/client";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface UpdateData {
  status: string;
  updateStatus: string | null;
  error: string | null;
}

const POLL_PERIOD_MS = 2000;

const loading = ref<boolean>(false);
const updating = ref<boolean>(false);
const updateData = ref<UpdateData>({
  status: "initializing...",
  updateStatus: null,
  error: null,
});

let timer: ReturnType<typeof setTimeout> | undefined;

const pollStatus = async () => {
  try {
    const res = await api.get<UpdateData>("/status");
    updateData.value = res.data;
    updating.value = res.data.status === "updating";
  } catch {
    // The device is unreachable while it reboots at the end of the update
  }
  if (updating.value) timer = setTimeout(pollStatus, POLL_PERIOD_MS);
};

const onUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files?.length !== 1) return;
  loading.value = true;
  const formData = new FormData();
  formData.append("bundle", files[0]);
  api
    .post("/update", formData)
    .then(() => {
      updating.value = true;
      toast.success(
        "Upload is successful, update is in progress, MAPIO will reboot at the end (few minutes)",
      );
      pollStatus();
    })
    .catch((err) => {
      console.error(err);
      alert(err.response?.data?.error ?? err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(pollStatus);
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <p>updater status: {{ updateData.status }}</p>
  <div class="file-upload" v-if="!loading && !updating">
    <div class="file-upload__area">
      <input type="file" name="" id="" @change="onUpload" />
    </div>
  </div>
  <div v-if="loading">
    <p>uploading file, please wait</p>
  </div>
  <div v-show="updating">
    <p v-if="updateData.updateStatus !== null">
      {{ updateData.updateStatus }}
    </p>
  </div>
  <p v-if="updateData.error" class="error">{{ updateData.error }}</p>
</template>
<style scoped>
.file-upload {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.file-upload .file-upload__area {
  width: 600px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  margin-top: 40px;
}
.error {
  color: red;
}
</style>
