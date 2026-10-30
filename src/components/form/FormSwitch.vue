<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    col?: string;
    error?: string[];
    modelValue?: boolean | number;
  }>(),
  { col: "col-12 md:col-6" },
);
defineEmits<{ (e: "update:modelValue", v: boolean): void }>();
</script>

<template>
  <div :class="`${col} mb-3`">
    <label :for="name" class="d-flex align-items-center gap-2">
      <input
        :id="name"
        type="checkbox"
        class="switch"
        :checked="Boolean(modelValue)"
        @change="
          $emit(
            'update:modelValue',
            ($event.target as HTMLInputElement).checked,
          )
        "
      />
      {{ label }}
    </label>
    <small class="fg-danger">{{ error?.[0] }}</small>
  </div>
</template>
