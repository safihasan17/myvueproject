<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { money } from "@/utils/format";
import { type Medicine } from "@/interfaces/Medicine";

const id = useRoute().params.id;
const d = ref<Medicine | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`medicines/${id}`)
  .then((res) => {
    d.value = res.data.medicine;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        { label: "Name", value: d.name },
        { label: "Generic name", value: d.generic_name },
        { label: "Category", value: d.category },
        { label: "Unit price", value: money(d.unit_price) },
        { label: "Stock", value: d.stock_quantity },
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
  <PageHead title="Medicine" subtitle="Medicine details">
    <RouterLink :to="`/edit-medicine/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/medicines" class="btn-solid theme-accent"
      >Go to Medicines List</RouterLink
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
