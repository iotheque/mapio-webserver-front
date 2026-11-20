<script lang="ts" setup>
import type { AxiosError } from "axios";
import { api } from "@/api/client";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const key = ref("");

function handleError(error: AxiosError<{ error?: string }>) {
  toast.error(error.response?.data?.error ?? "Something wrong");
}

function set() {
  api
    .post("/ssh-setkey", { userkey: key.value })
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
