<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { money } from "@/utils/format";
import { type LabTest } from "@/interfaces/LabTest";

const id = useRoute().params.id;
const d = ref<LabTest | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`lab-tests/${id}`)
  .then((res) => {
    d.value = res.data.labTest;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        { label: "Test", value: d.test_name },
        { label: "Price", value: money(d.price) },
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
  <PageHead title="Lab Test" subtitle="Lab Test details">
    <RouterLink :to="`/edit-lab-test/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/lab-tests" class="btn-solid theme-accent"
      >Go to Lab Tests List</RouterLink
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
