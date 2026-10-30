<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { onlyDate } from "@/utils/format";
import { formatTime, type Appointment } from "@/interfaces/Appointment";

const id = useRoute().params.id;
const d = ref<Appointment | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const router = useRouter();
const generateInvoice = () => {
  api
    .post(`appointments/${id}/generate-invoice`)
    .then((res) => router.push(`/invoice-details/${res.data.invoice_id}`))
    .catch((err) => {
      message.value = {
        type: "danger",
        text: err.response?.data?.message ?? "Failed to generate invoice",
      };
    });
};

api
  .get(`appointments/${id}`)
  .then((res) => {
    d.value = res.data.appointment;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        { label: "Patient", value: d.patient?.name },
        { label: "Doctor", value: d.doctor?.user?.name },
        { label: "Department", value: d.doctor?.department?.name },
        { label: "Date", value: onlyDate(d.appointment_date) },
        { label: "Time", value: formatTime(d.appointment_time) },
        { label: "Status", value: d.status },
        { label: "Reason", value: d.reason },
      ]
    : [];
});
const item = computed(() => d.value);

function print() {
  window.print();
}
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Appointment" subtitle="Appointment details">
    <RouterLink
      :to="`/add-prescription?appointment_id=${id}`"
      class="btn-outline theme-secondary"
      ><i class="bi bi-file-earmark-medical"></i> Add Prescription</RouterLink
    >
    <button
      type="button"
      class="btn-outline theme-secondary"
      @click="generateInvoice"
    >
      <i class="bi bi-receipt"></i> Generate invoice
    </button>
    <RouterLink :to="`/edit-appointment/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/appointments" class="btn-solid theme-accent"
      >Go to Appointments List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <div class="row">
            <div
              v-for="f in fields"
              :key="f.label"
              class="col-12 md:col-6 mb-4"
            >
              <div class="muted small mb-1">{{ f.label }}</div>
              <div class="fw-medium">{{ f.value || "—" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
