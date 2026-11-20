<script lang="ts">
import { api } from "@/api/client";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const selectedWifi = ref(null);
    const password = ref("");
    const ssids = ref(["Scan in progress..."]);

    const fetchData = () => {
      api
        .get("/getScan")
        .then((response) => {
          ssids.value = response.data.map(
            (item: { name: string }) => item.name,
          );
        })
        .catch((error) => {
          console.error("GET error:", error);
        });
    };

    const submitForm = () => {
      const formData = {
        selectedWifi: selectedWifi.value,
        password: password.value,
      };

      api
        .post("/wifi", formData)
        .then(() => {
          toast.success(
            "WIFI has been configured, you will loose the Access Point",
          );
        })
        .catch((error) => {
          console.error("POST error:", error);
          toast.error(
            error.response?.data?.error ?? "WIFI configuration failed",
          );
        });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      selectedWifi,
      password,
      ssids,
      submitForm,
    };
  },
};
</script>

<template>
  <v-autocomplete
    v-model="selectedWifi"
    :items="ssids"
    label="Select a SSID in the list"
  ></v-autocomplete>
  <v-text-field
    v-model="password"
    label="Password"
    type="password"
  ></v-text-field>
  <v-btn @click="submitForm" color="primary">Connection</v-btn>
</template>
