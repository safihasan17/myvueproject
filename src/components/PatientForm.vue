<script setup lang="ts">
import type { Patient } from "@/interfaces/Patient";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Patient;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const staticOpts_gender = (
  ["Male", "Female", "Other"] as readonly string[]
).map((s) => ({ value: s, label: s }));
const staticOpts_blood_group = (
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as readonly string[]
).map((s) => ({ value: s, label: s }));
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormInput
        v-model="data.name"
        label="Full name"
        name="name"
        :error="error.name"
      />
      <FormInput
        v-model="data.dob"
        label="Date of birth"
        name="dob"
        :error="error.dob"
        type="date"
      />
      <FormSelect
        v-model="data.gender"
        label="Gender"
        name="gender"
        :error="error.gender"
        placeholder="Select…"
        :options="staticOpts_gender"
      />
      <FormSelect
        v-model="data.blood_group"
        label="Blood group"
        name="blood_group"
        :required="false"
        :error="error.blood_group"
        placeholder="Select…"
        :options="staticOpts_blood_group"
      />
      <FormInput
        v-model="data.phone"
        label="Phone"
        name="phone"
        :error="error.phone"
      />
      <FormInput
        v-model="data.emergency_contact"
        label="Emergency contact"
        name="emergency_contact"
        :required="false"
        :error="error.emergency_contact"
      />
      <FormInput
        v-model="data.guardian_name"
        label="Guardian name"
        name="guardian_name"
        :required="false"
        :error="error.guardian_name"
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
