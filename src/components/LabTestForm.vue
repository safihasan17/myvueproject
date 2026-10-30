<script setup lang="ts">
import type { LabTest } from "@/interfaces/LabTest";
import FormInput from "@/components/form/FormInput.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: LabTest;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormInput
        v-model="data.test_name"
        label="Test name"
        name="test_name"
        :error="error.test_name"
      />
      <FormInput
        v-model="data.price"
        label="Price"
        name="price"
        :error="error.price"
        type="number"
        step="0.01"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
