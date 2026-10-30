<script setup lang="ts">
import type { Role } from "@/interfaces/Role";
import FormInput from "@/components/form/FormInput.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Role;
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
        label="Role name"
        name="name"
        col="col-12"
        :error="error.name"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
