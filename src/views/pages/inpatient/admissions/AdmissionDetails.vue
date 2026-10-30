<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { formatDateTime } from "@/utils/format";
import { type Admission } from "@/interfaces/Admission";

const id = useRoute().params.id;
const d = ref<Admission | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`admissions/${id}`)
  .then((res) => {
    d.value = res.data.admission;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        { label: "Patient", value: d.patient?.name },
        { label: "Phone", value: d.patient?.phone },
        { label: "Doctor", value: d.doctor?.user?.name },
        { label: "Department", value: d.doctor?.department?.name },
        { label: "Ward", value: d.ward?.name },
        { label: "Bed", value: d.bed?.bed_number },
        { label: "Admitted", value: formatDateTime(d.admission_date) },
        { label: "Discharged", value: formatDateTime(d.discharge_date) },
        { label: "Status", value: d.status },
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
  <PageHead title="Admission" subtitle="Admission details">
    <RouterLink :to="`/edit-admission/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/admissions" class="btn-solid theme-accent"
      >Go to Admissions List</RouterLink
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
