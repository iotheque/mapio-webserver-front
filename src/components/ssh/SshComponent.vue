<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const sshUrl = "http://" + location.hostname + ":8456/ssh-setkey";

const key = ref("");

function handleError(error: AxiosError<{ detail?: string }>) {
  if (error?.response?.data?.detail) {
    errorMsg.value = error.response.data.detail;
  }
  toast.error("Something wrong");
}

function set() {
  const formData = new FormData();
  const userkey = key.value;
  formData.append("userkey", userkey);
  axios
    .post(sshUrl, formData)
    .then(() => toast.success("SSH add key successfully"))
    .catch(handleError);
}
</script>

<template>
  <v-card elevation="2">
    <br />
    <v-card-text>
      <v-row> Paste your SSH public key, then click on SET </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field v-model="key" label="Key"></v-text-field>
        </v-col>
      </v-row>
      <br />
      <v-btn color="primary" @click="set">Set</v-btn>
    </v-card-text>
  </v-card>
</template>
