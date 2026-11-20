import { defineStore } from "pinia";
import { api } from "@/api/client";

export const useVersionStore = defineStore("version", {
  state: () => ({ os_version: "", internet: false }),
  getters: {},
  actions: {
    refresh() {
      api
        .get("/version")
        .then((response) => {
          this.os_version = response.data.os_version;
          this.internet = true;
        })
        .catch((error) => console.error(error));
    },
  },
});
