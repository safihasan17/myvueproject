<script setup lang="ts">
import type { Ward } from "@/interfaces/Ward";
import FormInput from "@/components/form/FormInput.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Ward;
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
        label="Ward name"
        name="name"
        :error="error.name"
      />
      <FormInput
        v-model="data.floor"
        label="Floor"
        name="floor"
        :error="error.floor"
      />
      <FormInput
        v-model="data.type"
        label="Type"
        name="type"
        :error="error.type"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
