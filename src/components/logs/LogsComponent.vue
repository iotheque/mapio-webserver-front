<script lang="ts" setup>
    import { ref, onMounted } from 'vue'

    const LogsUrl = 'http://' + location.hostname + ':8456/logs'
    const logs = ref('')

    const initSSE = () => {
        const eventSource = new EventSource(LogsUrl)
        eventSource.onmessage = (event) => {
            logs.value += event.data + '\n'
            console.log(event.data)
        }
        eventSource.onerror = (error) => {
            console.error('Erreur SSE:', error)
            eventSource.close()
        }
    }

    onMounted(() => {
        initSSE()
    })

    const formatLogs = (logString: string) => {
        return (
            logString.replace(/\u001b\[(\d+)m/g, (_, colorCode) => {
                switch (colorCode) {
                    case '30':
                        return '<span style="color: black;">'
                    case '31':
                        return '<span style="color: red;">'
                    case '32':
                        return '<span style="color: green;">'
                    case '33':
                        return '<span style="color: yellow;">'
                    case '34':
                        return '<span style="color: blue;">'
                    case '35':
                        return '<span style="color: magenta;">'
                    case '36':
                        return '<span style="color: cyan;">'
                    case '37':
                        return '<span style="color: white;">'
                    default:
                        return '<span>'
                }
            }) + '</span>'
        )
    }
</script>

<template>
    <div>
        <pre class="console" v-html="formatLogs(logs)"></pre>
    </div>
</template>

<style scoped>
    .console {
        background-color: black;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: 'Courier New', Courier, monospace;
        overflow-y: scroll;
        max-height: 1000px;
    }
</style>
