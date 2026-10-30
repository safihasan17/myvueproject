<script setup lang="ts">
defineProps<{ intro: string; flat?: boolean }>();
const year = new Date().getFullYear();
</script>

<template>
  <div class="auth-page">
    <!-- left info panel (desktop only) -->
    <aside class="auth-aside" :class="{ flat }">
      <div class="p-5 flex-grow-1 d-flex align-items-center">
        <div>
          <RouterLink to="/login" class="auth-brand">
            <i class="bi bi-hospital me-2"></i>Hospital MS
          </RouterLink>
          <p
            class="mt-3 mb-0"
            style="color: rgba(255, 255, 255, 0.75); max-width: 24rem"
          >
            {{ intro }}
          </p>
        </div>
      </div>
      <div class="p-5 d-flex justify-content-between align-items-center small">
        <span style="color: rgba(255, 255, 255, 0.55)">
          <strong>Hospital MS</strong> &copy; {{ year }}
        </span>
        <span class="d-flex gap-3">
          <a href="#" @click.prevent>Legal</a>
          <a href="#" @click.prevent>Contact</a>
          <a href="#" @click.prevent>Terms</a>
        </span>
      </div>
    </aside>

    <!-- form panel -->
    <section class="auth-main">
      <div class="auth-mobile-brand p-3 w-100 text-center">
        <span class="fw-semibold fs-lg"
          ><i class="bi bi-hospital me-2"></i>Hospital MS</span
        >
      </div>
      <div
        class="p-4 w-100 flex-grow-1 d-flex align-items-center justify-content-center"
      >
        <div class="auth-card"><slot /></div>
      </div>
      <div class="px-4 py-3 w-100 text-center small muted auth-mobile-brand">
        &copy; {{ year }} Hospital Management
      </div>
    </section>
  </div>
</template>
