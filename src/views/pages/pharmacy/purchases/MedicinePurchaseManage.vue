<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { onlyDate, money } from "@/utils/format";
import { type MedicinePurchase } from "@/interfaces/MedicinePurchase";

const loading = ref(true);
const items = ref<MedicinePurchase[]>([]);
const total = ref(0);
const search = ref("");
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);
// the "created / updated" message from Add / Edit hides after a few seconds
if (message.value) setTimeout(() => (message.value = null), 4000);

function getall() {
  api
    .get("medicine-purchases")
    .then((res) => {
      items.value = res.data.purchases ?? [];
      total.value = res.data.totalPurchases;
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
    if (!q) return true;
    return [item.supplier?.name, item.medicine?.name].some((v) =>
      String(v ?? "")
        .toLowerCase()
        .includes(q),
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
    .delete(`medicine-purchases/${deleteTarget.value.id}`)
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
    title="Purchases"
    subtitle="Medicine purchases (stock updates automatically)"
  >
    <RouterLink to="/add-purchase" class="btn-solid theme-accent"
      ><i class="bi bi-plus-lg"></i> Add Purchase</RouterLink
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
            placeholder="Search purchases..."
            style="max-width: 250px"
          />
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
              <th>Supplier</th>
              <th>Medicine</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Total</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-4"><Loader /></td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td colspan="7" class="text-center muted py-4">No data yet.</td>
            </tr>
            <tr
              v-else
              v-for="item in filtered"
              :key="item.id"
              class="align-middle"
            >
              <td>{{ onlyDate(item.purchase_date) }}</td>
              <td>{{ item.supplier?.name }}</td>
              <td>{{ item.medicine?.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ money(item.purchase_price) }}</td>
              <td>
                {{ money(Number(item.quantity) * Number(item.purchase_price)) }}
              </td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/purchase-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i></RouterLink
                ><RouterLink
                  :to="`/edit-purchase/${item.id}`"
                  title="Edit"
                  class="btn-outline theme-secondary btn-sm me-1"
                  ><i class="bi bi-pencil"></i></RouterLink
                ><button
                  type="button"
                  class="btn-outline theme-danger btn-sm"
                  title="Delete"
                  @click="
                    deleteTarget = {
                      id: item.id,
                      name: String(
                        `${item.medicine?.name ?? 'purchase'} (${onlyDate(item.purchase_date)})`,
                      ),
                    }
                  "
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="border-bottom-0" colspan="7">
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
    title="Delete Purchase"
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @close="deleteTarget = null"
  >
    Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong
    >?
  </ConfirmModal>
</template>
