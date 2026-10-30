<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { type PrescriptionMedicine } from "@/interfaces/PrescriptionMedicine";

const loading = ref(true);
const items = ref<PrescriptionMedicine[]>([]);
const total = ref(0);
const search = ref("");
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);
// the "created / updated" message from Add / Edit hides after a few seconds
if (message.value) setTimeout(() => (message.value = null), 4000);

function getall() {
  api
    .get("prescription-medicines")
    .then((res) => {
      items.value = res.data.prescriptionMedicines ?? [];
      total.value = res.data.prescriptionMedicines.length;
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
    return [item.medicine?.name, item.dosage, item.instructions].some((v) =>
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
    .delete(`prescription-medicines/${deleteTarget.value.id}`)
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
    title="Prescription Medicines"
    subtitle="Medicines written on prescriptions"
  >
    <RouterLink to="/add-prescription-medicine" class="btn-solid theme-accent"
      ><i class="bi bi-plus-lg"></i> Add Prescription Medicine</RouterLink
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
            placeholder="Search prescription medicines..."
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
              <th>Prescription</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Duration</th>
              <th>Instructions</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-4"><Loader /></td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td colspan="6" class="text-center muted py-4">No data yet.</td>
            </tr>
            <tr
              v-else
              v-for="item in filtered"
              :key="item.id"
              class="align-middle"
            >
              <td>
                {{ `RX-${String(item.prescription_id).padStart(4, "0")}` }}
              </td>
              <td>{{ item.medicine?.name }}</td>
              <td>{{ item.dosage }}</td>
              <td>{{ item.duration }}</td>
              <td>{{ item.instructions }}</td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/prescription-medicine-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i></RouterLink
                ><RouterLink
                  :to="`/edit-prescription-medicine/${item.id}`"
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
                        `RX-${String(item.prescription_id).padStart(4, '0')}`,
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
              <td class="border-bottom-0" colspan="6">
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
    title="Delete Prescription Medicine"
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @close="deleteTarget = null"
  >
    Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong
    >?
  </ConfirmModal>
</template>
