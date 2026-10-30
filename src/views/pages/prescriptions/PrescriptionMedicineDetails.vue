<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { type PrescriptionMedicine } from "@/interfaces/PrescriptionMedicine";

const id = useRoute().params.id;
const d = ref<PrescriptionMedicine | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`prescription-medicines/${id}`)
  .then((res) => {
    d.value = res.data.prescriptionMedicine;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        {
          label: "Prescription",
          value: `RX-${String(d.prescription_id).padStart(4, "0")}`,
        },
        { label: "Medicine", value: d.medicine?.name },
        { label: "Dosage", value: d.dosage },
        { label: "Duration", value: d.duration },
        { label: "Instructions", value: d.instructions },
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
  <PageHead
    title="Prescription Medicine"
    subtitle="Prescription Medicine details"
  >
    <RouterLink
      :to="`/edit-prescription-medicine/${id}`"
      class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/prescription-medicines" class="btn-solid theme-accent"
      >Go to Prescription Medicines List</RouterLink
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
