<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import PrescriptionForm from "@/components/PrescriptionForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import {
  emptyPrescription,
  prescriptionToPayload,
  type Prescription,
} from "@/interfaces/Prescription";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Prescription>({ ...emptyPrescription() });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`prescriptions/${id}`)
  .then((res) => {
    const copy = {
      ...emptyPrescription(),
      ...res.data.prescription,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = emptyPrescription() as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    const p = res.data.prescription;
    copy.appointment_id = p.appointment_id ?? "";
    copy.prescription_date = onlyDate(p.prescription_date);
    copy.admission_advised = Boolean(p.admission_advised);
    copy.medicines = (p.prescription_medicines ?? []).map(
      (r: {
        medicine_id: number;
        dosage: string | null;
        duration: string | null;
        instructions: string | null;
      }) => ({
        medicine_id: r.medicine_id,
        dosage: r.dosage ?? "",
        duration: r.duration ?? "",
        instructions: r.instructions ?? "",
      }),
    );
    // only Pending lab tests are editable (the API replaces only the Pending ones)
    copy.lab_tests = (p.lab_test_orders ?? [])
      .filter((o: { status: string }) => o.status === "Pending")
      .map((o: { test_id: number }) => ({ test_id: o.test_id }));
    data.value = copy as unknown as Prescription;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`prescriptions/${id}`, prescriptionToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Prescription updated successfully");
        router.push("/prescriptions");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else
        message.value = {
          type: "danger",
          text: err.response?.data?.message ?? "Failed to update",
        };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Edit Prescription" subtitle="Update this prescription">
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
            is-edit
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Prescription"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this prescription?
  </ConfirmModal>
</template>
