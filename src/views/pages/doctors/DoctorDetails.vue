<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import { api } from "@/api";
import {
  defaultDoctor,
  doctorImageUrl,
  type Doctor,
} from "@/interfaces/Doctor";

const id = useRoute().params.id;
const doctor = ref<Doctor>({ ...defaultDoctor });

api
  .get(`doctors/${id}`)
  .then((res) => {
    doctor.value = res.data.doctor;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => [
  { label: "Doctor", value: doctor.value.user?.name },
  { label: "Email", value: doctor.value.user?.email },
  { label: "Phone", value: doctor.value.user?.phone },
  { label: "Department", value: doctor.value.department?.name },
  { label: "Specialization", value: doctor.value.specialization },
  { label: "Qualification", value: doctor.value.qualification },
  { label: "Fee", value: doctor.value.consultation_fee },
]);

function print() {
  window.print();
}
</script>

<template>
  <PageHead title="Doctor" subtitle="Doctor details">
    <RouterLink :to="`/edit-doctor/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/doctors" class="btn-solid theme-accent"
      >Go to Doctors List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <div class="row">
            <div
              v-if="typeof doctor.image === 'string' && doctor.image"
              class="col-12 mb-4"
            >
              <img
                :src="doctorImageUrl(doctor.image)"
                alt=""
                class="rounded border object-fit-cover"
                style="height: 200px; width: 200px"
              />
            </div>
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
