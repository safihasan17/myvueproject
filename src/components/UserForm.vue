<script setup lang="ts">
import { computed } from "vue";
import type { User } from "@/interfaces/User";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";
import { useList } from "@/hooks/useList";

defineProps<{
  data: User;
  error: Record<string, string[] | undefined>;
  isEdit?: boolean;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const roles = useList("roles");
const roleOptions = computed(() =>
  roles.value.map((r) => ({ value: r.id as number, label: String(r.name) })),
);
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
        v-model="data.email"
        label="Email"
        name="email"
        type="email"
        :error="error.email"
      />
      <FormInput
        v-model="data.phone"
        label="Phone"
        name="phone"
        :error="error.phone"
      />
      <FormSelect
        v-model="data.role_id"
        label="Role"
        name="role_id"
        placeholder="Select…"
        :options="roleOptions"
        :error="error.role_id"
      />
      <template v-if="!isEdit">
        <FormInput
          v-model="data.password"
          label="Password"
          name="password"
          type="password"
          :error="error.password"
        />
        <FormInput
          v-model="data.password_confirmation"
          label="Confirm password"
          name="password_confirmation"
          type="password"
          :error="error.password_confirmation"
        />
      </template>
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
