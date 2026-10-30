<script setup lang="ts">
import { computed } from "vue";
import type { Invoice } from "@/interfaces/Invoice";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";
import { useOptions } from "@/hooks/useOptions";
import { onlyDate } from "@/utils/format";
import type { Row } from "@/hooks/useList";

const props = defineProps<{
  data: Invoice;
  error: Record<string, string[] | undefined>;
  isEdit?: boolean;
  invoiceId?: string;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const { options } = useOptions(
  "invoices/options",
  props.invoiceId ? { invoice_id: props.invoiceId } : {},
);
const toOpts = (rows: Row[], label: (o: Row) => string) =>
  rows.map((o) => ({ value: o.id as number, label: label(o) }));
const patientLabel = (o: Row) =>
  `${o.name}${o.phone ? " (" + o.phone + ")" : ""}`;
const patients = computed(() => toOpts(options.patients, patientLabel));
const admissions = computed(() =>
  toOpts(
    options.admissions.filter(
      (a) => !props.data.patient_id || a.patient_id === props.data.patient_id,
    ),
    (a) =>
      `#${a.id} – ${a.patient?.name ?? ""} (${onlyDate(a.admission_date)})`,
  ),
);
const appointments = computed(() =>
  toOpts(
    options.appointments.filter(
      (a) => !props.data.patient_id || a.patient_id === props.data.patient_id,
    ),
    (a) =>
      `#${a.id} – ${a.patient?.name ?? ""} (${onlyDate(a.appointment_date)})`,
  ),
);
const statuses = [
  { value: "Active", label: "Active" },
  { value: "Cancelled", label: "Cancelled" },
];
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
      <FormInput
        v-model="data.invoice_date"
        label="Invoice date"
        name="invoice_date"
        type="date"
        :error="error.invoice_date"
      />
      <FormSelect
        v-model="data.admission_id"
        label="Admission"
        name="admission_id"
        placeholder="None"
        :required="false"
        :options="admissions"
        :error="error.admission_id"
      />
      <FormSelect
        v-model="data.appointment_id"
        label="Appointment"
        name="appointment_id"
        placeholder="None"
        :required="false"
        :options="appointments"
        :error="error.appointment_id"
      />
      <FormInput
        v-model="data.total_amount"
        label="Total amount"
        name="total_amount"
        type="number"
        step="0.01"
        min="0"
        :error="error.total_amount"
      />
      <FormSelect
        v-if="isEdit"
        v-model="data.status"
        label="Status"
        name="status"
        :options="statuses"
        :required="false"
        :error="error.status"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
