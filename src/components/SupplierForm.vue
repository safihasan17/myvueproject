<script setup lang="ts">
import type { Supplier } from "@/interfaces/Supplier";
import FormInput from "@/components/form/FormInput.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Supplier;
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
        label="Supplier name"
        name="name"
        :error="error.name"
      />
      <FormInput
        v-model="data.contact"
        label="Contact"
        name="contact"
        :required="false"
        :error="error.contact"
      />
      <FormTextarea
        v-model="data.address"
        label="Address"
        name="address"
        :required="false"
        col="col-12"
        :error="error.address"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
