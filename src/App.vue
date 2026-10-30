<script setup lang="ts">
import { ref } from "vue";
import { RouterView, useRoute } from "vue-router";
import Footer from "./views/layouts/Footer.vue";
import Navbar from "./views/layouts/Navbar.vue";
import Sidebar from "./views/layouts/Sidebar.vue";

const route = useRoute();
const sidebarOpen = ref(false);
</script>

<template>
  <RouterView v-if="route.name === 'not-found' || route.meta.guest" />
  <div v-else class="app-shell" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- clicking a menu link closes the mobile sidebar -->
    <div
      @click="
        (e) => {
          if ((e.target as HTMLElement).closest('a')) sidebarOpen = false;
        }
      "
    >
      <Sidebar />
    </div>
    <div class="app-backdrop" @click="sidebarOpen = false"></div>
    <div class="app-main">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="content">
        <div class="container-fluid"><RouterView /></div>
        <Footer />
      </main>
    </div>
  </div>
</template>
