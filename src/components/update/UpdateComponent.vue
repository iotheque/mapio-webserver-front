<script setup lang="ts">
    import axios from 'axios'
    import { ref, onMounted } from 'vue'
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';

    const loading = ref<boolean>(false)
    const updating = ref<boolean>(false)
    const updateData = ref({
        status: 'initializing...',
        updateStatus: null,
        error: null,
    })

    const statusUrl = 'http://' + location.hostname + ':8456/status'
    const uploadUrl = 'http://' + location.hostname + ':8456/update'
    const onUpload = (e: Event) => {
        if (e.target.files.length === 1) {
            loading.value = true
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('bundle', file)
            axios
                .post(uploadUrl, formData, {
                    headers: {
                        'Content-Type': 'mulitpart/data',
                    },
                })
                .then((res) => {
                    loading.value = false
                    updating.value = true
                    toast.success(
                        'Upload is successful, update is in progress, MAPIO will reboot at the end (few minutes)'
                    )
                })
                .catch((err) => {
                    console.error(e)
                    alert(err.message)
                })
        }
    }
    const getStatus = async () => {
        await axios.get(statusUrl).then((res) => {
            if (res.data) {
                updateData.value = res.data
                if (updateData.value.status == 'updating') {
                    updating.value = true
                }
            }
            return updateData.value
        })
    }
    const pollStatus = () => {
        getStatus().then((res) => {
            if (res?.status !== 'idle' && res?.updateStatus !== 'done') {
                setTimeout(pollStatus, 500)
            }
        })
    }
    onMounted(pollStatus)
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
