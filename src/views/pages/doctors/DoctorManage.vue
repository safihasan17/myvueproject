<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { doctorImageUrl, type Doctor } from "@/interfaces/Doctor";

const loading = ref(true);
const doctors = ref<Doctor[]>([]);
const total = ref(0);
const search = ref("");
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);
if (message.value) setTimeout(() => (message.value = null), 4000);
const deleteTarget = ref<{ id: number; name: string } | null>(null);

function getall() {
  api
    .get("doctors")
    .then((res) => {
      doctors.value = res.data.doctors;
      total.value = res.data.totalDoctors;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
}
getall();

// simple client-side search on name / department / specialization
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return doctors.value;
  return doctors.value.filter((d) =>
    [d.user?.name, d.department?.name, d.specialization].some((v) =>
      (v ?? "").toLowerCase().includes(q),
    ),
  );
});

function print() {
  window.print();
}

const handleDelete = (id: number, name: string) => {
  deleteTarget.value = { id, name };
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  api
    .delete(`doctors/${deleteTarget.value.id}`)
    .then((res) => {
      message.value = {
        type: "success",
        text: res.data?.message ?? "Doctor deleted successfully",
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
    title="Doctors"
    subtitle="Doctor profiles, departments and consultation fees"
  >
    <RouterLink to="/add-doctor" class="btn-solid theme-accent"
      ><i class="bi bi-plus-lg"></i> Add Doctor</RouterLink
    >
  </PageHead>

  <div class="row">
    <div class="col-12">
      <div class="d-flex gap-2 mb-3 flex-wrap justify-content-between">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search doctors..."
          style="max-width: 250px"
        />
        <div class="d-flex gap-2">
          <button type="button" class="btn-outline theme-secondary">
            <i class="bi bi-file-earmark-excel"></i> Excel
          </button>
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
              <th>Doctor</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Qualification</th>
              <th>Fee</th>
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
                <img
                  v-if="typeof item.image === 'string' && item.image"
                  :src="doctorImageUrl(item.image)"
                  alt=""
                  width="50"
                  height="50"
                  class="rounded-circle me-2 object-fit-cover"
                />
                {{ item.user?.name ?? `Doctor #${item.id}` }}
              </td>
              <td>{{ item.department?.name }}</td>
              <td>{{ item.specialization }}</td>
              <td>{{ item.qualification }}</td>
              <td>{{ item.consultation_fee }}</td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/doctor-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i
                ></RouterLink>
                <RouterLink
                  :to="`/edit-doctor/${item.id}`"
                  title="Edit"
                  class="btn-outline theme-secondary btn-sm me-1"
                  ><i class="bi bi-pencil"></i
                ></RouterLink>
                <button
                  type="button"
                  class="btn-outline theme-danger btn-sm"
                  title="Delete"
                  @click="
                    handleDelete(
                      item.id,
                      item.user?.name ?? `Doctor #${item.id}`,
                    )
                  "
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="border-bottom-0" colspan="2">
                Showing
                {{ filtered.length ? `1–${filtered.length}` : "0–0" }} of
                {{ total }}
              </td>
              <td colspan="4" class="border-bottom-0">
                <nav
                  aria-label="Page navigation"
                  class="d-flex justify-content-end"
                >
                  <ul class="pagination mb-0 theme-accent">
                    <li class="page-item disabled">
                      <button class="page-link">Previous</button>
                    </li>
                    <li class="page-item active">
                      <button class="page-link">1</button>
                    </li>
                    <li class="page-item disabled">
                      <button class="page-link">Next</button>
                    </li>
                  </ul>
                </nav>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="deleteTarget !== null"
    title="Delete Doctor"
    confirm-text="Delete"
    confirm-variant="danger"
    @confirm="confirmDelete"
    @close="deleteTarget = null"
  >
    Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong
    >?
  </ConfirmModal>
</template>
