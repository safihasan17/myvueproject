<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    col?: string;
    placeholder?: string;
    step?: string;
    min?: string;
    error?: string[];
    modelValue?: string | number | null;
  }>(),
  { type: "text", required: true, col: "col-12 md:col-6" },
);
defineEmits<{ (e: "update:modelValue", v: string): void }>();
</script>

<template>
  <div :class="`${col} mb-3`">
    <div class="form-field">
      <label :for="name" class="form-label"
        >{{ label }} <span v-if="required" class="fg-danger">*</span></label
      >
      <input
        :id="name"
        :type="type"
        class="form-control"
        :class="{ 'is-invalid': error?.[0] }"
        :placeholder="placeholder"
        :step="step"
        :min="min"
        :value="modelValue ?? ''"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <small class="fg-danger">{{ error?.[0] }}</small>
    </div>
  </div>
</template>
