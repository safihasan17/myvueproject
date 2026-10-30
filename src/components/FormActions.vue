<script setup lang="ts">
defineProps<{ submitText?: string; showClear?: boolean }>();
defineEmits<{ (e: "clear"): void }>();
</script>

<template>
  <div class="d-flex gap-2">
    <button type="submit" class="btn-solid theme-accent">
      {{ submitText ?? "Save" }}
    </button>
    <button
      v-if="showClear"
      type="button"
      class="btn-outline theme-secondary"
      @click="$emit('clear')"
    >
      Clear
    </button>
  </div>
</template>
