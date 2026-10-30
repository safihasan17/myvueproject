<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { onlyDate, money } from "@/utils/format";
import { type Payment } from "@/interfaces/Payment";

const id = useRoute().params.id;
const d = ref<Payment | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`payments/${id}`)
  .then((res) => {
    d.value = res.data.payment;
  })
  .catch((err) => {
    console.log(err);
  });

const fields = computed(() => {
  const d = item.value;
  return d
    ? [
        {
          label: "Invoice",
          value: `INV-${String(d.invoice_id).padStart(4, "0")}`,
        },
        { label: "Patient", value: d.invoice?.patient?.name },
        { label: "Amount", value: money(d.amount) },
        { label: "Method", value: d.payment_method },
        { label: "Date", value: onlyDate(d.payment_date) },
        { label: "Status", value: d.status },
        { label: "Gateway", value: d.gateway },
        { label: "Transaction", value: d.transaction_id },
        { label: "Received by", value: d.receiver?.name },
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
  <PageHead title="Payment" subtitle="Payment details">
    <RouterLink :to="`/edit-payment/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/payments" class="btn-solid theme-accent"
      >Go to Payments List</RouterLink
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
