<template>
    <div class="home ma-5">
        <h1>Home</h1>
        <br />
        <p>Welcome on MAPIO webserver configuration</p>
        <br />
        <p>On this server you can do the following things :</p>
        <ul>
            <li>∙ Configure your WIFI credentials</li>
            <li>∙ Start, stop and update some Docker services</li>
            <li>∙ Create your MAPIO SSH access</li>
            <li>∙ Update MAPIO OS</li>
            <li>∙ Monitor docker compose logs</li>
        </ul>
        <v-img max-height="150px" max-width="150px" src="/mapio_logo.png" class="ml-auto"></v-img>
    </div>
</template>

<script>
    export default {
        name: 'HomeView',
    }
</script>
