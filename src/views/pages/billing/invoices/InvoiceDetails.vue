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
  <AlertMessage class="no-print" :message="message" @close="message = null" />
  <PageHead class="no-print" title="Invoice" subtitle="Invoice details">
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

  <div v-if="inv" class="row g-3">
    <!-- ============ invoice sheet (this is what gets printed) ============ -->
    <div class="col-12 lg:col-8">
      <div class="inv-sheet bg-white border rounded p-4">
        <!-- header -->
        <div
          class="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom"
        >
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-hospital-fill fs-lg"></i>
            <div>
              <div class="fs-lg fw-bold">Hospital MS</div>
              <div class="muted small">Invoice / Bill</div>
            </div>
          </div>
          <div class="text-end">
            <div class="fs-lg fw-bold">{{ inv_no(inv.id) }}</div>
            <div class="muted small mb-1">
              Date: {{ onlyDate(inv.invoice_date) }}
            </div>
            <span :class="badgeClass(inv.status)">{{ inv.status }}</span>
          </div>
        </div>

        <!-- patient / appointment / admission -->
        <div class="row g-3 mb-3">
          <div class="col-12 md:col-4">
            <div class="border rounded p-3 h-100">
              <div class="muted small text-uppercase">Billed to</div>
              <div class="fw-semibold">{{ inv.patient?.name }}</div>
              <div v-if="inv.patient?.phone" class="small">
                <i class="bi bi-telephone"></i> {{ inv.patient.phone }}
              </div>
              <div v-if="inv.patient?.address" class="small muted">
                {{ inv.patient.address }}
              </div>
            </div>
          </div>
          <div v-if="inv.appointment" class="col-12 md:col-4">
            <div class="border rounded p-3 h-100">
              <div class="muted small text-uppercase">Appointment</div>
              <div class="fw-semibold">
                #{{ inv.appointment.id }} ·
                {{ onlyDate(inv.appointment.appointment_date) }}
              </div>
              <div class="small">
                Dr. {{ inv.appointment.doctor?.user?.name }}
              </div>
            </div>
          </div>
          <div v-if="inv.admission" class="col-12 md:col-4">
            <div class="border rounded p-3 h-100">
              <div class="muted small text-uppercase">Admission</div>
              <div class="fw-semibold">
                #{{ inv.admission.id }}
                <template v-if="inv.admission.ward || inv.admission.bed"
                  >· {{ inv.admission.ward?.name }}
                  {{ inv.admission.bed?.bed_number }}</template
                >
              </div>
            </div>
          </div>
        </div>

        <!-- items -->
        <table class="table table-sm mb-3">
          <thead>
            <tr class="small text-uppercase">
              <th style="width: 2.5rem">#</th>
              <th>Type</th>
              <th>Description</th>
              <th class="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, i) in inv.items ?? []" :key="it.id">
              <td class="muted">{{ i + 1 }}</td>
              <td>{{ it.item_type }}</td>
              <td>{{ it.description }}</td>
              <td class="text-end">{{ money(it.amount) }}</td>
            </tr>
            <tr v-if="!(inv.items ?? []).length">
              <td colspan="4" class="muted text-center">No line items.</td>
            </tr>
          </tbody>
        </table>

        <!-- payments (print only) + totals -->
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div class="flex-grow-1 print-only">
            <template v-if="(inv.payments ?? []).length">
              <div class="muted small text-uppercase mb-1">
                Payments received
              </div>
              <table class="table table-sm table-borderless mb-0 small">
                <tbody>
                  <tr v-for="p in inv.payments ?? []" :key="p.id">
                    <td>{{ onlyDate(p.payment_date) }}</td>
                    <td>{{ p.payment_method }}</td>
                    <td class="text-end">{{ money(p.amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
          <div class="ms-auto w-100 inv-totals">
            <div class="d-flex justify-content-between px-2 py-1">
              <span>Total</span><span class="fw-bold">{{ money(total) }}</span>
            </div>
            <div class="d-flex justify-content-between px-2 py-1">
              <span>Paid</span><span>{{ money(paid) }}</span>
            </div>
            <div
              class="d-flex justify-content-between border-top px-2 py-2 mt-1 fw-bold"
              :class="due > 0 ? 'fg-danger' : 'fg-success'"
            >
              <span>Due</span><span>{{ money(due) }}</span>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div
          class="d-flex justify-content-between flex-wrap gap-2 border-top mt-4 pt-3 small muted"
        >
          <span>Thank you. Get well soon.</span>
          <span>This is a computer-generated invoice.</span>
        </div>
      </div>
    </div>

    <!-- ============ side panel (screen only) ============ -->
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

<!-- Only what Bootstrap has no utility for: one-page A4 printing -->
<style>
.inv-sheet {
  border-top: 4px solid var(--accent, #2f6fed) !important;
}
.inv-totals {
  max-width: 280px;
}
.print-only {
  display: none;
}

@page {
  size: A4;
  margin: 10mm;
}
@media print {
  html,
  body,
  #app,
  .app-main,
  .content,
  .content > .container-fluid {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 0 !important;
    height: auto !important;
    display: block !important;
  }
  .print-only {
    display: block;
  }
  /* always full width + one column on paper, whatever the window size was */
  .row > .lg\:col-8 {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  .inv-sheet {
    border: 0 !important;
    border-top: 4px solid #2f6fed !important;
    border-radius: 0 !important;
    padding: 6mm 0 0 !important;
    background: #fff !important;
    color: #000 !important;
    font-size: 12px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .inv-sheet * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .inv-sheet tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>