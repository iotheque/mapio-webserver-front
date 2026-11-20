<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, Ref } from "vue";
import { api } from "@/api/client";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Service {
  name: string;
  image: string;
  version: string;
}

interface Container {
  name: string;
  status: string;
  port: string;
}

interface ServiceUpdate {
  name: string;
  update: string;
}

const REFRESH_PERIOD_MS = 5000;

const composeServices = ref<Service[]>([]);
const composeSwitchValues: Ref<Record<string, boolean>> = ref({});
const dockerSwitchValues: Ref<Record<string, boolean>> = ref({});
const runningContainers = ref<Container[]>([]);
const updateInfo: Ref<Record<string, string>> = ref({});

function selectedNames(switches: Record<string, boolean>): string[] {
  return Object.entries(switches)
    .filter(([, isSelected]) => isSelected)
    .map(([name]) => name);
}

function sendAction(
  path: string,
  switches: Ref<Record<string, boolean>>,
  action: string,
) {
  const selectedServices = selectedNames(switches.value);
  if (selectedServices.length === 0) {
    toast.warning("Select at least one item");
    return;
  }
  api
    .post(path, { selectedServices, select_action: action })
    .then(() => toast.success("Action has been asked, please wait ..."))
    .catch((error) => {
      console.error(error);
      toast.error(
        "Action refused: " + (error.response?.data?.error ?? error.message),
      );
    });
  for (const key in switches.value) {
    switches.value[key] = false;
  }
}

const actioncompose = (action: string) =>
  sendAction("/compose", composeSwitchValues, action);
const actioncustom = (action: string) =>
  sendAction("/docker", dockerSwitchValues, action);

function checkforupdates() {
  api
    .get<ServiceUpdate[]>("/docker-update")
    .then((response) => {
      response.data.forEach((serviceUpdate) => {
        updateInfo.value[serviceUpdate.name] = serviceUpdate.update;
      });
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
}

const fetchData = () => {
  api
    .get<Service[]>("/compose")
    .then((response) => {
      composeServices.value = response.data;
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
  api
    .get<Container[]>("/docker")
    .then((response) => {
      runningContainers.value = response.data;
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
};

let interval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  fetchData();
  interval = setInterval(fetchData, REFRESH_PERIOD_MS);
});

onBeforeUnmount(() => clearInterval(interval));
</script>

<template>
  <h4>Docker compose services</h4>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Select</th>
        <th class="text-left">Service name</th>
        <th class="text-left">Image</th>
        <th class="text-left">Version</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in composeServices" :key="item.name">
        <td>
          <v-checkbox
            v-model="composeSwitchValues[item.name]"
            color="blue"
          ></v-checkbox>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.image }}</td>
        <td>{{ item.version }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-btn
    color="primary"
    class="ma-2 pa-2"
    @click="() => actioncompose('create')"
    >Create/Recreate</v-btn
  >
  <v-btn color="primary" class="ma-2 pa-2" @click="() => actioncompose('pull')"
    >Pull/Update</v-btn
  >

  <div class="docker ma-5">
    <h4>Docker Containers</h4>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Select</th>
          <th class="text-left">Service name</th>
          <th class="text-center">Container status</th>
          <th class="text-left">Ports</th>
          <th class="text-left">Update available</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in runningContainers" :key="item.name">
          <td>
            <v-checkbox
              v-model="dockerSwitchValues[item.name]"
              color="blue"
            ></v-checkbox>
          </td>
          <td>{{ item.name }}</td>

          <td class="text-center">
            <v-icon class="status-icon" v-if="item.status === 'Up'"
              >mdi-play-circle-outline</v-icon
            >
            <v-icon class="status-icon" v-else>mdi-stop</v-icon>
          </td>
          <td>{{ item.port }}</td>
          <td>{{ updateInfo[item.name] }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-btn
      color="primary"
      class="ma-2 pa-2"
      @click="() => actioncustom('start')"
      >Start</v-btn
    >
    <v-btn color="primary" class="ma-2 pa-2" @click="() => actioncustom('stop')"
      >Stop</v-btn
    >
    <v-btn color="primary" class="ma-2 pa-2" @click="() => checkforupdates()"
      >Check for updates</v-btn
    >
  </div>
</template>
