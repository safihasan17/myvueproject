<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    required?: boolean;
    col?: string;
    rows?: number;
    error?: string[];
    modelValue?: string | null;
  }>(),
  { required: true, col: "col-12 md:col-6", rows: 3 },
);
defineEmits<{ (e: "update:modelValue", v: string): void }>();
</script>

<template>
  <div :class="`${col} mb-3`">
    <div class="form-field">
      <label :for="name" class="form-label"
        >{{ label }} <span v-if="required" class="fg-danger">*</span></label
      >
      <textarea
        :id="name"
        class="form-control"
        :class="{ 'is-invalid': error?.[0] }"
        :rows="rows"
        :value="modelValue ?? ''"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
      ></textarea>
      <small class="fg-danger">{{ error?.[0] }}</small>
    </div>
  </div>
</template>
