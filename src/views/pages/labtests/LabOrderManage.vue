<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { onlyDate } from "@/utils/format";
import { badgeClass } from "@/utils/badge";
import { labOrderStatuses, type LabOrder } from "@/interfaces/LabOrder";

const loading = ref(true);
const items = ref<LabOrder[]>([]);
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
    .get("lab-test-orders")
    .then((res) => {
      items.value = res.data.labTestOrders ?? [];
      total.value = res.data.labTestOrders.length;
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
      [item.patient?.name, item.doctor?.user?.name, item.test?.test_name].some(
        (v) =>
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
    .delete(`lab-test-orders/${deleteTarget.value.id}`)
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
  <PageHead title="Lab Orders" subtitle="Lab test orders and results">
    <RouterLink to="/add-lab-order" class="btn-solid theme-accent"
      ><i class="bi bi-plus-lg"></i> Add Lab Order</RouterLink
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
            placeholder="Search lab orders..."
            style="max-width: 250px"
          />
          <select
            v-model="filter"
            class="form-control"
            style="max-width: 180px"
          >
            <option value="">All status</option>
            <option v-for="s in labOrderStatuses" :key="s" :value="s">
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
              <th>Order</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Test</th>
              <th>Status</th>
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
              <td>{{ `#${item.id}` }}</td>
              <td>{{ onlyDate(item.order_date) }}</td>
              <td>{{ item.patient?.name }}</td>
              <td>{{ item.doctor?.user?.name }}</td>
              <td>{{ item.test?.test_name }}</td>
              <td>
                <span :class="badgeClass(item.status)">{{ item.status }}</span>
              </td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/lab-order-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i></RouterLink
                ><RouterLink
                  :to="`/edit-lab-order/${item.id}`"
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
                      name: String(`Order #${item.id}`),
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
    title="Delete Lab Order"
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @close="deleteTarget = null"
  >
    Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong
    >?
  </ConfirmModal>
</template>
