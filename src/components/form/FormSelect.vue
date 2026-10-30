<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}
const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    col?: string;
    disabled?: boolean;
    error?: string[];
    modelValue?: string | number | null;
  }>(),
  { required: true, col: "col-12 md:col-6", disabled: false },
);
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
}>();

// keeps numeric ids as numbers (e.g. user_id, department_id)
function change(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  const picked = props.options.find((o) => String(o.value) === value);
  emit("update:modelValue", picked ? picked.value : "");
}
const current = () =>
  String(props.modelValue ?? "") === "0" ? "" : String(props.modelValue ?? "");
</script>

<template>
  <div :class="`${col} mb-3`">
    <div class="form-field">
      <label :for="name" class="form-label"
        >{{ label }} <span v-if="required" class="fg-danger">*</span></label
      >
      <select
        :id="name"
        class="form-control"
        :class="{ 'is-invalid': error?.[0] }"
        :disabled="disabled"
        :value="current()"
        @change="change"
      >
        <option value="">{{ placeholder ?? `Select ${label}` }}</option>
        <option
          v-for="o in options"
          :key="o.value"
          :value="String(o.value)"
          :selected="String(o.value) === current()"
        >
          {{ o.label }}
        </option>
      </select>
      <small class="fg-danger">{{ error?.[0] }}</small>
    </div>
  </div>
</template>
