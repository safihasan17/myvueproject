<script setup lang="ts">
defineProps<{ message: { type: "success" | "danger"; text: string } | null }>();
defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div
    v-if="message"
    :class="`alert theme-${message.type} d-flex justify-content-between align-items-center mb-3`"
    role="alert"
  >
    <span>{{ message.text }}</span>
    <button
      type="button"
      class="btn-close"
      aria-label="Close"
      @click="$emit('close')"
    ></button>
  </div>
</template>
