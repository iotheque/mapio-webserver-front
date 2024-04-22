<script lang="ts">
    import axios from 'axios'
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';
    const wifiUrl = 'http://' + location.hostname + ':8456/getScan'
    const setWifiUrl = 'http://' + location.hostname + ':8456/wifi'

    export default {
        setup() {
            const selectedWifi = ref(null)
            const password = ref('')
            const ssids = ref([])

            const fetchData = () => {
                axios
                    .get(wifiUrl)
                    .then((response) => {
                        ssids.value = response.data.map((item: { name: string }) => item.name)
                    })
                    .catch((error) => {
                        console.error('GET error:', error)
                    })
            }

            const submitForm = () => {
                const formData = {
                    selectedWifi: selectedWifi.value,
                    password: password.value,
                }

                axios
                    .post(setWifiUrl, formData)
                    .then((response) => {
                        console.log('POST reply:', response.data)
                    })
                    .catch((error) => {
                        console.error('POST error:', error)
                    })
                toast.success('WIFI has been configured, you will loose the Access Point')
            }

            onMounted(() => {
                fetchData()
            })

            const interval = setInterval(() => {
                fetchData()
            }, 5000) // Refresh period 5000 millisecondes

            onBeforeUnmount(() => {
                clearInterval(interval)
            })

            return {
                selectedWifi,
                password,
                ssids,
                submitForm,
            }
        },
    }
</script>

<template>
    <v-autocomplete v-model="selectedWifi" :items="ssids" label="Select a SSID in the list"></v-autocomplete>
    <v-text-field v-model="password" label="Password" type="password"></v-text-field>
    <v-btn @click="submitForm" color="primary">Connection</v-btn>
</template>
