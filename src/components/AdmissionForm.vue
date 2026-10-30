<script setup lang="ts">
import { computed, watch } from "vue";
import { admissionStatuses, type Admission } from "@/interfaces/Admission";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";
import type { Row } from "@/hooks/useList";

const props = defineProps<{
  data: Admission;
  options: Record<string, Row[]>;
  error: Record<string, string[] | undefined>;
  submitText?: string;
}>();
defineEmits<{ (e: "submit"): void }>();

const toOpts = (rows: Row[], label: (o: Row) => string) =>
  rows.map((o) => ({ value: o.id as number, label: label(o) }));
const patientLabel = (o: Row) =>
  `${o.name}${o.phone ? " (" + o.phone + ")" : ""}`;
const doctorLabel = (o: Row) =>
  `${o.user?.name ?? "Doctor #" + o.id}${o.department ? " – " + o.department.name : ""}`;
const patients = computed(() => toOpts(props.options.patients, patientLabel));
const doctors = computed(() => toOpts(props.options.doctors, doctorLabel));
const wards = computed(() => toOpts(props.options.wards, (o) => o.name));
// only beds of the chosen ward
const beds = computed(() =>
  toOpts(
    props.options.beds.filter((b) => b.ward_id === props.data.ward_id),
    (b) =>
      `${b.bed_number}${b.status !== "Available" ? " (" + b.status + ")" : ""}`,
  ),
);
const statuses = admissionStatuses.map((s) => ({ value: s, label: s }));

// changing the ward clears a bed that belongs to another ward
watch(
  () => props.data.ward_id,
  (ward) => {
    const bed = props.options.beds.find((b) => b.id === props.data.bed_id);
    if (!bed || bed.ward_id !== ward) props.data.bed_id = "";
  },
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.patient_id"
        label="Patient"
        name="patient_id"
        placeholder="Select…"
        :options="patients"
        :error="error.patient_id"
      />
      <FormSelect
        v-model="data.doctor_id"
        label="Doctor"
        name="doctor_id"
        placeholder="Select…"
        :options="doctors"
        :error="error.doctor_id"
      />
      <FormSelect
        v-model="data.ward_id"
        label="Ward"
        name="ward_id"
        placeholder="Select…"
        :options="wards"
        :error="error.ward_id"
      />
      <FormSelect
        v-model="data.bed_id"
        label="Bed"
        name="bed_id"
        :placeholder="data.ward_id ? 'Select…' : 'Select a ward first'"
        :disabled="!data.ward_id"
        :options="beds"
        :error="error.bed_id"
      />
      <FormInput
        v-model="data.admission_date"
        label="Admission date"
        name="admission_date"
        type="datetime-local"
        :error="error.admission_date"
      />
      <FormInput
        v-model="data.discharge_date"
        label="Discharge date"
        name="discharge_date"
        type="datetime-local"
        :required="false"
        :error="error.discharge_date"
      />
      <FormSelect
        v-model="data.status"
        label="Status"
        name="status"
        :options="statuses"
        :error="error.status"
      />
    </div>
    <FormActions :submit-text="submitText" />
  </form>
</template>
