<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div
        class="d-flex flex-column md:flex-row justify-content-between md:align-items-center mb-4 gap-3"
      >
        <div>
          <h1 class="fs-xl mb-1">{{ title }}</h1>
          <p v-if="subtitle" class="mb-0">{{ subtitle }}</p>
        </div>
        <div class="d-flex gap-2 no-print"><slot /></div>
      </div>
    </div>
  </div>
</template>
