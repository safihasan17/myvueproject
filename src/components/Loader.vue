<script setup lang="ts">
withDefaults(defineProps<{ size?: number; text?: string }>(), { size: 40 });
</script>

<template>
  <div class="d-flex flex-column align-items-center gap-2">
    <div
      class="spinner-border fg-primary"
      role="status"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <span class="visually-hidden">{{ text || "Loading..." }}</span>
    </div>
    <p v-if="text" class="mb-0 muted small">{{ text }}</p>
  </div>
</template>
