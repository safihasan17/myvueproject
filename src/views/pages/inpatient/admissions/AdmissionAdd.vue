<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import AdmissionForm from "@/components/AdmissionForm.vue";
import { api } from "@/api";
import {
  emptyAdmission,
  admissionToCreatePayload,
  type Admission,
} from "@/interfaces/Admission";
import { nowLocalInput, onlyDate } from "@/utils/format";
import { useOptions } from "@/hooks/useOptions";
import { setFlash } from "@/utils/flash";

const route = useRoute();
const router = useRouter();
// /add-admission?prescription_id=5 pre-selects the patient and doctor of that prescription
const prescriptionId =
  (route.query.prescription_id as string | undefined) || undefined;

const { options, prescription, conflictId, conflictMessage } = useOptions(
  "admissions/options",
  { prescription_id: prescriptionId },
);
const data = ref<Admission>(emptyAdmission());
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

watch(prescription, (p) => {
  if (!p) return;
  data.value = {
    ...data.value,
    prescription_id: p.id,
    patient_id: p.patient_id,
    doctor_id: p.doctor_id,
  };
});

// admission date defaults to the prescription date (current time)
if (prescriptionId) {
  api
    .get(`prescriptions/${prescriptionId}`)
    .then((res) => {
      const d = onlyDate(res.data.prescription?.prescription_date);
      if (d) data.value.admission_date = `${d}T${nowLocalInput().slice(11)}`;
    })
    .catch((err) => console.log(err));
}

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmAdd = () => {
  api
    .post("admissions", admissionToCreatePayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Admission recorded successfully",
        );
        router.push(prescriptionId ? "/prescriptions" : "/admissions");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422)
        error.value = err.response.data.errors ?? {};
      else
        message.value = {
          type: "danger",
          text: err.response?.data?.message ?? "Failed to add admission",
        };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <div v-if="conflictId" class="alert theme-danger mb-3">
    {{ conflictMessage }}
    <RouterLink :to="`/admission-details/${conflictId}`"
      >View admission</RouterLink
    >
  </div>
  <PageHead
    title="Add Admission"
    :subtitle="
      prescription
        ? `Admit the patient of prescription #${prescription.id}`
        : 'Admit a patient to a ward bed'
    "
  >
    <RouterLink to="/admissions" class="btn-solid theme-accent"
      >Go to Admissions List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <AdmissionForm
            :data="data"
            :options="options"
            :error="error"
            submit-text="Add Admission"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Add Admission"
    confirm-text="Add Admission"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to admit this patient?
  </ConfirmModal>
</template>
