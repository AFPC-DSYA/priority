<template>
    <v-toolbar dark color="primary darken-1 pb-0 mb-0">
        <v-toolbar-title class="white--text">
            <router-link to="/"><img src="../../static/afpc_log.png" height="30px"></router-link>
            Priority Units
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn to="/" flat>Units</v-btn>
        <v-btn to="/afsc" flat>AFSC</v-btn>
        <v-btn to="/history" flat>History</v-btn>
    </v-toolbar>

</template>

<script>
export default {
    data() {
        return {
            drawer: false
        }
    }
} 
</script>

<style scoped>
    .elevate-3 {
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23);
    }

    button:hover {
        background-color: #4285F4;
    }
    button:active {
        background-color: #0d47a1;
    }
</style>
