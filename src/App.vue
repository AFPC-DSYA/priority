<template>
    <v-app>
        <app-navbar></app-navbar>
        <v-content>
            <v-container fluid class="mt-0 pt-0">
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'App',
  components: {
    'app-navbar': Navbar
  }
}
</script>

<style>
</style>
