<script setup lang="ts">
import { computed } from "vue";
import {
  appointmentStatuses,
  type Appointment,
} from "@/interfaces/Appointment";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormActions from "@/components/FormActions.vue";
import { useList } from "@/hooks/useList";

defineProps<{
  data: Appointment;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const patients = useList("patients", "patients");
const patientsOptions = computed(() =>
  patients.value.map((o) => ({
    value: o.id as number,
    label: String(`${o.name}${o.phone ? " (" + o.phone + ")" : ""}`),
  })),
);
const doctors = useList("doctors", "doctors");
const doctorsOptions = computed(() =>
  doctors.value.map((o) => ({
    value: o.id as number,
    label: String(
      `${o.user?.name ?? "Doctor #" + o.id}${o.department ? " – " + o.department.name : ""}`,
    ),
  })),
);
const staticOpts_status = ([...appointmentStatuses] as readonly string[]).map(
  (s) => ({ value: s, label: s }),
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.patient_id"
        label="Patient"
        name="patient_id"
        :error="error.patient_id"
        placeholder="Select…"
        :options="patientsOptions"
      />
      <FormSelect
        v-model="data.doctor_id"
        label="Doctor"
        name="doctor_id"
        :error="error.doctor_id"
        placeholder="Select…"
        :options="doctorsOptions"
      />
      <FormInput
        v-model="data.appointment_date"
        label="Date"
        name="appointment_date"
        :error="error.appointment_date"
        type="date"
      />
      <FormInput
        v-model="data.appointment_time"
        label="Time"
        name="appointment_time"
        :error="error.appointment_time"
        type="time"
      />
      <FormSelect
        v-model="data.status"
        label="Status"
        name="status"
        :error="error.status"
        placeholder="Select…"
        :options="staticOpts_status"
      />
      <FormTextarea
        v-model="data.reason"
        label="Reason"
        name="reason"
        :required="false"
        col="col-12"
        :error="error.reason"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
