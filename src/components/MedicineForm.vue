<script setup lang="ts">
import type { Medicine } from "@/interfaces/Medicine";
import FormInput from "@/components/form/FormInput.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Medicine;
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
        v-model="data.name"
        label="Name"
        name="name"
        :error="error.name"
      />
      <FormInput
        v-model="data.generic_name"
        label="Generic name"
        name="generic_name"
        :required="false"
        :error="error.generic_name"
      />
      <FormInput
        v-model="data.category"
        label="Category"
        name="category"
        :required="false"
        :error="error.category"
      />
      <FormInput
        v-model="data.unit_price"
        label="Unit price"
        name="unit_price"
        :error="error.unit_price"
        type="number"
        step="0.01"
      />
      <FormInput
        v-model="data.stock_quantity"
        label="Stock quantity"
        name="stock_quantity"
        :error="error.stock_quantity"
        type="number"
        min="0"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
