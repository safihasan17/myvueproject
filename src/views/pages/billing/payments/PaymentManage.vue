<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { onlyDate, money } from "@/utils/format";
import { badgeClass } from "@/utils/badge";
import { paymentStatuses, type Payment } from "@/interfaces/Payment";

const loading = ref(true);
const items = ref<Payment[]>([]);
const total = ref(0);
const search = ref("");
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);
// the "created / updated" message from Add / Edit hides after a few seconds
if (message.value) setTimeout(() => (message.value = null), 4000);
const filter = ref("");

function getall() {
  api
    .get("payments")
    .then((res) => {
      items.value = res.data.payments ?? [];
      total.value = res.data.totalPayments;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
}
getall();

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return items.value.filter((item) => {
    if (!q) return true && (!filter.value || item.status === filter.value);
    return (
      [
        item.invoice?.patient?.name,
        item.payment_method,
        item.transaction_id,
      ].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      ) &&
      (!filter.value || item.status === filter.value)
    );
  });
});

function print() {
  window.print();
}

const deleteTarget = ref<{ id: number; name: string } | null>(null);
const confirmDelete = () => {
  if (!deleteTarget.value) return;
  api
    .delete(`payments/${deleteTarget.value.id}`)
    .then((res) => {
      message.value = {
        type: "success",
        text: res.data?.message ?? "Deleted successfully",
      };
      getall();
    })
    .catch((err) => {
      console.log(err);
      message.value = {
        type: "danger",
        text: err.response?.data?.message ?? "Failed to delete",
      };
    })
    .finally(() => {
      deleteTarget.value = null;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead
    title="Payments"
    subtitle="Payments received against invoices (new payments are taken from an invoice)"
  >
  </PageHead>

  <div class="row">
    <div class="col-12">
      <div class="d-flex gap-2 mb-3 flex-wrap justify-content-between">
        <div class="d-flex gap-2 flex-wrap">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search payments..."
            style="max-width: 250px"
          />
          <select
            v-model="filter"
            class="form-control"
            style="max-width: 180px"
          >
            <option value="">All status</option>
            <option v-for="s in paymentStatuses" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn-outline theme-secondary"
            @click="print"
          >
            <i class="bi bi-file-earmark-pdf"></i> PDF
          </button>
        </div>
      </div>
      <div class="card table-responsive">
        <table class="table mb-0 text-nowrap table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Patient</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Received by</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-4"><Loader /></td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td colspan="8" class="text-center muted py-4">No data yet.</td>
            </tr>
            <tr
              v-else
              v-for="item in filtered"
              :key="item.id"
              class="align-middle"
            >
              <td>{{ onlyDate(item.payment_date) }}</td>
              <td>{{ `INV-${String(item.invoice_id).padStart(4, "0")}` }}</td>
              <td>{{ item.invoice?.patient?.name }}</td>
              <td>{{ money(item.amount) }}</td>
              <td>{{ item.payment_method }}</td>
              <td>
                <span :class="badgeClass(item.status)">{{ item.status }}</span>
              </td>
              <td>{{ item.receiver?.name }}</td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/payment-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i></RouterLink
                ><RouterLink
                  :to="`/edit-payment/${item.id}`"
                  title="Edit"
                  class="btn-outline theme-secondary btn-sm me-1"
                  ><i class="bi bi-pencil"></i></RouterLink
                ><button
                  type="button"
                  class="btn-outline theme-danger btn-sm"
                  title="Delete"
                  @click="
                    deleteTarget = { id: item.id, name: String(`#${item.id}`) }
                  "
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="border-bottom-0" colspan="8">
                Showing {{ filtered.length }} of {{ total }}
              </td>
            </tr>
          </tfoot>
        </table>
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
    Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong
    >?
  </ConfirmModal>
</template>
