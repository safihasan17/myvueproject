<script setup lang="ts">
import { computed } from "vue";
import { labOrderStatuses, type LabOrder } from "@/interfaces/LabOrder";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormActions from "@/components/FormActions.vue";
import { useOptions } from "@/hooks/useOptions";
import type { Row } from "@/hooks/useList";

const props = defineProps<{
  data: LabOrder;
  error: Record<string, string[] | undefined>;
  isEdit?: boolean;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const { options } = useOptions("lab-test-orders/options");
const toOpts = (rows: Row[], label: (o: Row) => string) =>
  rows.map((o) => ({ value: o.id as number, label: label(o) }));
const patientLabel = (o: Row) =>
  `${o.name}${o.phone ? " (" + o.phone + ")" : ""}`;
const doctorLabel = (o: Row) =>
  `${o.user?.name ?? "Doctor #" + o.id}${o.department ? " – " + o.department.name : ""}`;
const patients = computed(() => toOpts(options.patients, patientLabel));
const doctors = computed(() => toOpts(options.doctors, doctorLabel));
const tests = computed(() =>
  toOpts(
    options.labTests,
    (o) => `${o.test_name}${o.price ? " – " + o.price : ""}`,
  ),
);
const statuses = labOrderStatuses.map((s) => ({ value: s, label: s }));

const addRow = () => props.data.lab_tests.push({ test_id: "" });
const removeRow = (i: number) => props.data.lab_tests.splice(i, 1);
const rowError = (i: number) => props.error[`lab_tests.${i}.test_id`]?.[0];
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
      <FormInput
        v-model="data.order_date"
        label="Order date"
        name="order_date"
        type="date"
        :error="error.order_date"
      />
      <FormSelect
        v-model="data.status"
        label="Status"
        name="status"
        :options="statuses"
        :error="error.status"
      />

      <FormSelect
        v-if="isEdit"
        v-model="data.test_id"
        label="Test"
        name="test_id"
        placeholder="Select…"
        :options="tests"
        :error="error.test_id"
      />
      <div v-else class="col-12 mb-3">
        <label class="form-label">Tests <span class="fg-danger">*</span></label>
        <div v-for="(row, i) in data.lab_tests" :key="i" class="mb-2">
          <div class="d-flex gap-2">
            <select
              v-model="row.test_id"
              class="form-control"
              :class="{ 'is-invalid': rowError(i) }"
            >
              <option value="">Select test…</option>
              <option v-for="t in tests" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
            <button
              type="button"
              class="btn-outline theme-danger"
              :disabled="data.lab_tests.length === 1"
              title="Remove"
              @click="removeRow(i)"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <small class="fg-danger">{{ rowError(i) }}</small>
        </div>
        <small class="fg-danger d-block mb-2">{{ error.lab_tests?.[0] }}</small>
        <button
          type="button"
          class="btn-outline theme-secondary btn-sm"
          @click="addRow"
        >
          <i class="bi bi-plus-lg"></i> Add test
        </button>
      </div>

      <FormTextarea
        v-model="data.result"
        label="Result"
        name="result"
        :required="false"
        col="col-12"
        :error="error.result"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
