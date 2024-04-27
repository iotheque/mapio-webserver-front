import { defineStore } from "pinia";
import axios from "axios";

const versionApiBaseUrl = "http://" + location.hostname + ":8456/version";

export const useVersionStore = defineStore("version", {
  state: () => ({ os_version: "", internet: false }),
  getters: {},
  actions: {
    refresh() {
      axios
        .get(versionApiBaseUrl)
        .then((response) => {
          this.os_version = response.data.os_version;
          this.internet = true;
        })
        .catch((error) => console.error(error));
    },
  },
});
