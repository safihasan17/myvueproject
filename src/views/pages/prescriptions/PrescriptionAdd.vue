<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import PrescriptionForm from "@/components/PrescriptionForm.vue";
import { api } from "@/api";
import {
  emptyPrescription,
  prescriptionToPayload,
  type Prescription,
} from "@/interfaces/Prescription";

const data = ref<Prescription>({ ...emptyPrescription() });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const router = useRouter();
// /add-prescription?appointment_id=5 pre-fills patient, doctor and appointment
const appointmentId = useRoute().query.appointment_id;
if (appointmentId) {
  api
    .get(`appointments/${appointmentId}`)
    .then((res) => {
      const a = res.data.appointment;
      data.value = {
        ...data.value,
        appointment_id: a.id,
        patient_id: a.patient_id,
        doctor_id: a.doctor_id,
      };
    })
    .catch((err) => console.log(err));
}

watch(message, (m) => {
  if (m) setTimeout(() => (message.value = null), 3000);
});

// submitting the form only opens the confirm modal
const handleSubmit = () => {
  showConfirm.value = true;
};

const handleClear = () => {
  data.value = { ...emptyPrescription() };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("prescriptions", prescriptionToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Prescription created successfully",
        );
        router.push("/prescriptions");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else
        message.value = { type: "danger", text: "Failed to add prescription" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead
    title="Add Prescription"
    subtitle="Create a new prescription record"
  >
    <RouterLink to="/prescriptions" class="btn-solid theme-accent"
      >Go to Prescriptions List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <PrescriptionForm
            :data="data"
            :error="error"
            submit-text="Add Prescription"
            show-clear
            @submit="handleSubmit"
            @clear="handleClear"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Add Prescription"
    confirm-text="Add Prescription"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this prescription?
  </ConfirmModal>
</template>
