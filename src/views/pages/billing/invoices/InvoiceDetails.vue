<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import { api } from "@/api";
import { badgeClass } from "@/utils/badge";
import { money, onlyDate, todayLocal } from "@/utils/format";
import type { Invoice } from "@/interfaces/Invoice";
import { paymentMethods } from "@/interfaces/Payment";

const id = useRoute().params.id as string;
const inv = ref<Invoice | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

function load() {
  api
    .get(`invoices/${id}`)
    .then((res) => {
      inv.value = res.data.invoice;
    })
    .catch((err) => console.log(err));
}
load();

const total = computed(() => Number(inv.value?.total_amount ?? 0));
const paid = computed(() => Number(inv.value?.paid_amount ?? 0));
const due = computed(() => Math.max(0, total.value - paid.value));
const canPay = computed(
  () => inv.value && inv.value.status !== "Cancelled" && due.value > 0,
);

// ---- take a payment
const pay = ref({
  amount: "" as string | number,
  payment_method: "Cash",
  payment_date: todayLocal(),
});
const payError = ref<Record<string, string[] | undefined>>({});
const methodOptions = paymentMethods.map((m) => ({
  value: m as string,
  label: m as string,
}));

const takePayment = () => {
  payError.value = {};
  api
    .post("payments", { invoice_id: Number(id), ...pay.value })
    .then((res) => {
      message.value = {
        type: "success",
        text:
          typeof res.data.success === "string"
            ? res.data.success
            : "Payment received",
      };
      pay.value.amount = "";
      load();
    })
    .catch((err) => {
      if (err.response?.status === 422)
        payError.value = err.response.data.errors ?? {};
      else
        message.value = {
          type: "danger",
          text: err.response?.data?.message ?? "Failed to take payment",
        };
    });
};

// ---- delete a payment
const deleteTarget = ref<number | null>(null);
const confirmDelete = () => {
  if (deleteTarget.value === null) return;
  api
    .delete(`payments/${deleteTarget.value}`)
    .then(() => load())
    .catch((err) => {
      message.value = {
        type: "danger",
        text: err.response?.data?.message ?? "Failed to delete payment",
      };
    })
    .finally(() => {
      deleteTarget.value = null;
    });
};

const inv_no = (n: number) => `INV-${String(n).padStart(4, "0")}`;
function print() {
  window.print();
}
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Invoice" subtitle="Invoice details">
    <RouterLink :to="`/edit-invoice/${id}`" class="btn-outline theme-accent"
      ><i class="bi bi-pencil"></i> Edit</RouterLink
    >
    <button type="button" class="btn-outline theme-secondary" @click="print">
      <i class="bi bi-printer"></i> Print
    </button>
    <RouterLink to="/invoices" class="btn-solid theme-accent"
      >Go to Invoices List</RouterLink
    >
  </PageHead>

  <div v-if="inv" class="row">
    <div class="col-12 lg:col-8">
      <div class="card mb-3">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div class="fs-lg fw-bold">{{ inv_no(inv.id) }}</div>
              <div class="muted small">
                Date: {{ onlyDate(inv.invoice_date) }}
              </div>
            </div>
            <span :class="badgeClass(inv.status)">{{ inv.status }}</span>
          </div>
          <div class="row">
            <div class="col-12 md:col-6 mb-3">
              <div class="muted small mb-1">Patient</div>
              <div class="fw-medium">{{ inv.patient?.name }}</div>
              <div v-if="inv.patient?.phone" class="small">
                {{ inv.patient.phone }}
              </div>
            </div>
            <div v-if="inv.appointment" class="col-12 md:col-6 mb-3">
              <div class="muted small mb-1">Appointment</div>
              <div class="fw-medium">
                #{{ inv.appointment.id }} ·
                {{ onlyDate(inv.appointment.appointment_date) }}
              </div>
              <div class="small">{{ inv.appointment.doctor?.user?.name }}</div>
            </div>
            <div v-if="inv.admission" class="col-12 md:col-6 mb-3">
              <div class="muted small mb-1">Admission</div>
              <div class="fw-medium">
                #{{ inv.admission.id }} · {{ inv.admission.ward?.name }}
                {{ inv.admission.bed?.bed_number }}
              </div>
            </div>
          </div>

          <table class="table mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th class="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="it in inv.items ?? []" :key="it.id">
                <td>{{ it.item_type }}</td>
                <td>{{ it.description }}</td>
                <td class="text-end">{{ money(it.amount) }}</td>
              </tr>
              <tr v-if="!(inv.items ?? []).length">
                <td colspan="3" class="muted text-center">No line items.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-end fw-medium">Total</td>
                <td class="text-end fw-bold">{{ money(total) }}</td>
              </tr>
              <tr>
                <td colspan="2" class="text-end">Paid</td>
                <td class="text-end">{{ money(paid) }}</td>
              </tr>
              <tr>
                <td colspan="2" class="text-end fw-medium">Due</td>
                <td class="text-end fw-bold fg-danger">{{ money(due) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <div class="col-12 lg:col-4 no-print">
      <div v-if="canPay" class="card mb-3">
        <div class="card-body p-4">
          <h2 class="fs-lg mb-3">Take payment</h2>
          <form @submit.prevent="takePayment">
            <div class="row">
              <FormInput
                v-model="pay.amount"
                label="Amount"
                name="pay_amount"
                type="number"
                step="0.01"
                col="col-12"
                :placeholder="`Due ${money(due)}`"
                :error="payError.amount"
              />
              <FormSelect
                v-model="pay.payment_method"
                label="Method"
                name="pay_method"
                :options="methodOptions"
                col="col-12"
                :error="payError.payment_method"
              />
              <FormInput
                v-model="pay.payment_date"
                label="Date"
                name="pay_date"
                type="date"
                col="col-12"
                :error="payError.payment_date"
              />
            </div>
            <button type="submit" class="btn-solid theme-accent">
              Receive payment
            </button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-4">
          <h2 class="fs-lg mb-3">Payments</h2>
          <div v-if="!(inv.payments ?? []).length" class="muted small">
            No payments yet.
          </div>
          <div
            v-for="p in inv.payments ?? []"
            :key="p.id"
            class="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div>
              <div class="fw-medium">
                {{ money(p.amount) }}
                <span :class="badgeClass(p.status)">{{ p.status }}</span>
              </div>
              <div class="small muted">
                {{ p.payment_method }} · {{ onlyDate(p.payment_date) }}
              </div>
            </div>
            <div class="text-nowrap">
              <RouterLink
                :to="`/edit-payment/${p.id}`"
                class="btn-outline theme-secondary btn-sm me-1"
                title="Edit"
                ><i class="bi bi-pencil"></i
              ></RouterLink>
              <button
                type="button"
                class="btn-outline theme-danger btn-sm"
                title="Delete"
                @click="deleteTarget = p.id"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="deleteTarget !== null"
    title="Delete Payment"
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @close="deleteTarget = null"
  >
    Delete this payment? The invoice will be recalculated.
  </ConfirmModal>
</template>
