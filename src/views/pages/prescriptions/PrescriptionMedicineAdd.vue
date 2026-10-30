<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import PrescriptionMedicineForm from "@/components/PrescriptionMedicineForm.vue";
import { api } from "@/api";
import {
  defaultPrescriptionMedicine,
  prescriptionMedicineToPayload,
  type PrescriptionMedicine,
} from "@/interfaces/PrescriptionMedicine";

const data = ref<PrescriptionMedicine>({ ...defaultPrescriptionMedicine });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const router = useRouter();

watch(message, (m) => {
  if (m) setTimeout(() => (message.value = null), 3000);
});

// submitting the form only opens the confirm modal
const handleSubmit = () => {
  showConfirm.value = true;
};

const handleClear = () => {
  data.value = { ...defaultPrescriptionMedicine };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("prescription-medicines", prescriptionMedicineToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Prescription Medicine created successfully",
        );
        router.push("/prescription-medicines");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else
        message.value = {
          type: "danger",
          text: "Failed to add prescription medicine",
        };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead
    title="Add Prescription Medicine"
    subtitle="Create a new prescription medicine record"
  >
    <RouterLink to="/prescription-medicines" class="btn-solid theme-accent"
      >Go to Prescription Medicines List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <PrescriptionMedicineForm
            :data="data"
            :error="error"
            submit-text="Add Prescription Medicine"
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
    title="Add Prescription Medicine"
    confirm-text="Add Prescription Medicine"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this prescription medicine?
  </ConfirmModal>
</template>
