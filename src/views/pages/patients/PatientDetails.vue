<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { onlyDate } from "@/utils/format";
import { type Patient } from "@/interfaces/Patient";

const id = useRoute().params.id;
const d = ref<Patient | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`patients/${id}`)
  .then((res) => {
    d.value = res.data.patient;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        { label: "Name", value: d.name },
        { label: "Date of birth", value: onlyDate(d.dob) },
        { label: "Gender", value: d.gender },
        { label: "Blood group", value: d.blood_group },
        { label: "Phone", value: d.phone },
        { label: "Emergency contact", value: d.emergency_contact },
        { label: "Guardian", value: d.guardian_name },
        { label: "Address", value: d.address },
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
  <PageHead title="Patient" subtitle="Patient details">
    <RouterLink :to="`/edit-patient/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/patients" class="btn-solid theme-accent"
      >Go to Patients List</RouterLink
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
