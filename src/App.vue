<template>
  <div id="app" class="container-fluid grey lighten-5">
        <app-navbar></app-navbar>
        <div class="pt-5 mt-3" style="min-height: 800px;">
            <router-view></router-view>
        </div>
  </div>
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
