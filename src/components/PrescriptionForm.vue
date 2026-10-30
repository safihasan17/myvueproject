<script setup lang="ts">
import { computed } from "vue";
import { emptyMedicineRow, type Prescription } from "@/interfaces/Prescription";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormSwitch from "@/components/form/FormSwitch.vue";
import FormActions from "@/components/FormActions.vue";
import { useOptions } from "@/hooks/useOptions";
import { onlyDate } from "@/utils/format";
import type { Row } from "@/hooks/useList";

const props = defineProps<{
  data: Prescription;
  error: Record<string, string[] | undefined>;
  isEdit?: boolean;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const { options } = useOptions("prescriptions/options");
const toOpts = (rows: Row[], label: (o: Row) => string) =>
  rows.map((o) => ({ value: o.id as number, label: label(o) }));
const patientLabel = (o: Row) =>
  `${o.name}${o.phone ? " (" + o.phone + ")" : ""}`;
const doctorLabel = (o: Row) =>
  `${o.user?.name ?? "Doctor #" + o.id}${o.department ? " – " + o.department.name : ""}`;
const patients = computed(() => toOpts(options.patients, patientLabel));
const doctors = computed(() => toOpts(options.doctors, doctorLabel));
// appointments of the selected patient (all if none selected)
const appointments = computed(() =>
  toOpts(
    options.appointments.filter(
      (a) => !props.data.patient_id || a.patient_id === props.data.patient_id,
    ),
    (a) =>
      `#${a.id} – ${onlyDate(a.appointment_date)}${a.patient ? " – " + a.patient.name : ""}`,
  ),
);
const medicines = computed(() => toOpts(options.medicines, (o) => o.name));
const tests = computed(() => toOpts(options.labTests, (o) => o.test_name));

const addMedicine = () => props.data.medicines.push({ ...emptyMedicineRow });
const removeMedicine = (i: number) => props.data.medicines.splice(i, 1);
const addTest = () => props.data.lab_tests.push({ test_id: "" });
const removeTest = (i: number) => props.data.lab_tests.splice(i, 1);
const err = (key: string) => props.error[key]?.[0];
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
        v-model="data.appointment_id"
        label="Appointment"
        name="appointment_id"
        placeholder="None"
        :required="false"
        :options="appointments"
        :error="error.appointment_id"
      />
      <FormInput
        v-model="data.prescription_date"
        label="Date"
        name="prescription_date"
        type="date"
        :error="error.prescription_date"
      />
      <FormTextarea
        v-model="data.notes"
        label="Notes / diagnosis"
        name="notes"
        :required="false"
        col="col-12"
        :error="error.notes"
      />
      <FormSwitch
        v-model="data.admission_advised"
        label="Admission advised"
        name="admission_advised"
        col="col-12"
      />

      <div class="col-12 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="form-label mb-0">Medicines</label>
          <button
            type="button"
            class="btn-outline theme-secondary btn-sm"
            @click="addMedicine"
          >
            <i class="bi bi-plus-lg"></i> Add medicine
          </button>
        </div>
        <div v-if="data.medicines.length === 0" class="muted small">
          No medicines added.
        </div>
        <div
          v-for="(row, i) in data.medicines"
          :key="i"
          class="row g-2 mb-2 align-items-start"
        >
          <div class="col-12 md:col-4">
            <select
              v-model="row.medicine_id"
              class="form-control"
              :class="{ 'is-invalid': err(`medicines.${i}.medicine_id`) }"
            >
              <option value="">Medicine…</option>
              <option v-for="m in medicines" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
            <small class="fg-danger">{{
              err(`medicines.${i}.medicine_id`)
            }}</small>
          </div>
          <div class="col-6 md:col-2">
            <input
              v-model="row.dosage"
              class="form-control"
              placeholder="Dosage"
            />
          </div>
          <div class="col-6 md:col-2">
            <input
              v-model="row.duration"
              class="form-control"
              placeholder="Duration"
            />
          </div>
          <div class="col-10 md:col-3">
            <input
              v-model="row.instructions"
              class="form-control"
              placeholder="Instructions"
            />
          </div>
          <div class="col-2 md:col-1">
            <button
              type="button"
              class="btn-outline theme-danger"
              title="Remove"
              @click="removeMedicine(i)"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="form-label mb-0">Lab tests</label>
          <button
            type="button"
            class="btn-outline theme-secondary btn-sm"
            @click="addTest"
          >
            <i class="bi bi-plus-lg"></i> Add lab test
          </button>
        </div>
        <div v-if="data.lab_tests.length === 0" class="muted small">
          No lab tests added.
        </div>
        <div v-for="(row, i) in data.lab_tests" :key="i" class="mb-2">
          <div class="d-flex gap-2">
            <select
              v-model="row.test_id"
              class="form-control"
              :class="{ 'is-invalid': err(`lab_tests.${i}.test_id`) }"
            >
              <option value="">Lab test…</option>
              <option v-for="t in tests" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
            <button
              type="button"
              class="btn-outline theme-danger"
              title="Remove"
              @click="removeTest(i)"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <small class="fg-danger">{{ err(`lab_tests.${i}.test_id`) }}</small>
        </div>
      </div>
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
