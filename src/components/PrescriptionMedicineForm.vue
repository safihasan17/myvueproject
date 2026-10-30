<script setup lang="ts">
import { computed } from "vue";
import type { PrescriptionMedicine } from "@/interfaces/PrescriptionMedicine";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import FormActions from "@/components/FormActions.vue";
import { useList } from "@/hooks/useList";

defineProps<{
  data: PrescriptionMedicine;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const prescriptions = useList("prescriptions", "prescriptions");
const prescriptionsOptions = computed(() =>
  prescriptions.value.map((o) => ({
    value: o.id as number,
    label: String(
      `RX-${String(o.id).padStart(4, "0")} – ${o.patient?.name ?? ""}`,
    ),
  })),
);
const medicines = useList("medicines", "medicines");
const medicinesOptions = computed(() =>
  medicines.value.map((o) => ({
    value: o.id as number,
    label: String(o.name),
  })),
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.prescription_id"
        label="Prescription"
        name="prescription_id"
        :error="error.prescription_id"
        placeholder="Select…"
        :options="prescriptionsOptions"
      />
      <FormSelect
        v-model="data.medicine_id"
        label="Medicine"
        name="medicine_id"
        :error="error.medicine_id"
        placeholder="Select…"
        :options="medicinesOptions"
      />
      <FormInput
        v-model="data.dosage"
        label="Dosage"
        name="dosage"
        :required="false"
        :error="error.dosage"
      />
      <FormInput
        v-model="data.duration"
        label="Duration"
        name="duration"
        :required="false"
        :error="error.duration"
      />
      <FormTextarea
        v-model="data.instructions"
        label="Instructions"
        name="instructions"
        :required="false"
        col="col-12"
        :error="error.instructions"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
