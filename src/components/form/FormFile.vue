<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    accept?: string;
    required?: boolean;
    col?: string;
    preview?: string;
    error?: string[];
    modelValue?: File | string | null;
  }>(),
  { accept: "image/*", required: false, col: "col-12 md:col-6" },
);
const emit = defineEmits<{ (e: "update:modelValue", v: File | null): void }>();

const input = ref<HTMLInputElement | null>(null);
const isFile = computed(() => props.modelValue instanceof File);
// when the form is cleared (value is not a File) also empty the file input
watch(
  () => props.modelValue,
  (v) => {
    if (!(v instanceof File) && input.value) input.value.value = "";
  },
);
</script>

<template>
  <div :class="`${col} mb-3`">
    <div class="form-field">
      <label :for="name" class="form-label"
        >{{ label }} <span v-if="required" class="fg-danger">*</span></label
      >
      <input
        ref="input"
        :id="name"
        type="file"
        :accept="accept"
        class="form-control"
        @change="
          emit(
            'update:modelValue',
            ($event.target as HTMLInputElement).files?.[0] ?? null,
          )
        "
      />
      <img
        v-if="preview && !isFile"
        :src="preview"
        alt=""
        class="mt-2 rounded border"
        style="height: 64px"
      />
      <small class="fg-danger">{{ error?.[0] }}</small>
    </div>
  </div>
</template>
