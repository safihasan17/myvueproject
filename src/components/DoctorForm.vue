<script setup lang="ts">
import { computed } from "vue";
import type { User } from "@/interfaces/User";
import type { Department } from "@/interfaces/Department";
import {
  doctorImageUrl,
  type Doctor,
  type DoctorError,
} from "@/interfaces/Doctor";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormFile from "@/components/form/FormFile.vue";
import FormActions from "@/components/FormActions.vue";

const props = defineProps<{
  data: Doctor;
  users: User[];
  departments: Department[];
  error: DoctorError;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

// only users with the Doctor role
const doctorUsers = computed(() =>
  props.users
    .filter((u) => u.role?.name === "Doctor")
    .map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
);
const departmentOptions = computed(() =>
  props.departments.map((d) => ({ value: d.id, label: d.name })),
);
const preview = computed(() =>
  typeof props.data.image === "string" && props.data.image
    ? doctorImageUrl(props.data.image)
    : undefined,
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.user_id"
        label="Doctor account (user with Doctor role)"
        name="user_id"
        placeholder="Select…"
        :options="doctorUsers"
        :error="error.user_id"
      />
      <FormSelect
        v-model="data.department_id"
        label="Department"
        name="department_id"
        placeholder="Select…"
        :required="false"
        :options="departmentOptions"
        :error="error.department_id"
      />
      <FormInput
        v-model="data.specialization"
        label="Specialization"
        name="specialization"
        :required="false"
        :error="error.specialization"
      />
      <FormInput
        v-model="data.qualification"
        label="Qualification"
        name="qualification"
        :required="false"
        :error="error.qualification"
      />
      <FormInput
        v-model="data.consultation_fee"
        label="Consultation fee"
        name="consultation_fee"
        type="number"
        :required="false"
        :error="error.consultation_fee"
      />
      <FormFile
        v-model="data.image"
        label="Photo (max 500 KB)"
        name="image"
        :preview="preview"
        :error="error.image"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
