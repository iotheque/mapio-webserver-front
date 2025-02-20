<script lang="ts" setup>
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
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

const DockerUrl = "http://" + location.hostname + ":8456/compose";
const DockerUrlCustom = "http://" + location.hostname + ":8456/docker";

const composeServices = ref<Service[]>([]);
const composeSwitchValues: Ref<Record<string, boolean>> = ref({});
const dockerSwitchValues: Ref<Record<string, boolean>> = ref({});
const runningContainers = ref<Container[]>([]);

function actioncompose(action: string) {
  const selectedServices = Object.entries(composeSwitchValues.value)
    .filter(([serviceName, isSelected]) => isSelected)
    .map(([serviceName, isSelected]) => serviceName);
  const payload = JSON.stringify({ selectedServices, select_action: action });
  axios.post(DockerUrl, payload).catch((error) => console.log(error));
  toast.success("Action has been asked, please wait ...");
  for (const key in composeSwitchValues.value) {
    composeSwitchValues.value[key] = false;
  }
}

function actioncustom(action: string) {
  const selectedServices = Object.entries(dockerSwitchValues.value)
    .filter(([serviceName, isSelected]) => isSelected)
    .map(([serviceName, isSelected]) => serviceName);
  const payload = JSON.stringify({ selectedServices, select_action: action });
  axios.post(DockerUrlCustom, payload).catch((error) => console.log(error));
  toast.success("Action has been asked, please wait ...");
  for (const key in dockerSwitchValues.value) {
    dockerSwitchValues.value[key] = false;
  }
}

const fetchData = () => {
  axios
    .get(DockerUrl)
    .then((response) => {
      const servicesData: { name: string; image: string; version: string }[] =
        response.data;
      const services: Service[] = servicesData.map((service) => ({
        name: service.name,
        image: service.image,
        version: service.version,
      }));
      composeServices.value = services;
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
  axios
    .get(DockerUrlCustom)
    .then((response) => {
      const containersData: { name: string; status: string; port: string }[] =
        response.data;
      const containersWithStatus: Container[] = containersData.map(
        (container) => ({
          name: container.name,
          status: container.status,
          port: container.port,
        }),
      );
      runningContainers.value = containersWithStatus;
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
};

onMounted(() => {
  fetchData();
});

const interval = setInterval(() => {
  fetchData();
}, 5000); // Refresh period 1000 millisecondes
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
  </div>
</template>
