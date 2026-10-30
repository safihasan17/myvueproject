<script setup lang="ts">
import { computed, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { takeFlash } from "@/utils/flash";
import { api } from "@/api";
import { type Department } from "@/interfaces/Department";

const loading = ref(true);
const items = ref<Department[]>([]);
const total = ref(0);
const search = ref("");
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);
// the "created / updated" message from Add / Edit hides after a few seconds
if (message.value) setTimeout(() => (message.value = null), 4000);

function getall() {
  api
    .get("departments")
    .then((res) => {
      items.value = res.data.departments ?? [];
      total.value = res.data.departments.length;
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
    return [item.name, item.description].some((v) =>
      String(v ?? "")
        .toLowerCase()
        .includes(q),
    );
  });
});

function print() {
  window.print();
}
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Departments" subtitle="Hospital departments"> </PageHead>

  <div class="row">
    <div class="col-12">
      <div class="d-flex gap-2 mb-3 flex-wrap justify-content-between">
        <div class="d-flex gap-2 flex-wrap">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search departments..."
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
              <th>Department</th>
              <th>Description</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="text-center py-4"><Loader /></td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td colspan="3" class="text-center muted py-4">No data yet.</td>
            </tr>
            <tr
              v-else
              v-for="item in filtered"
              :key="item.id"
              class="align-middle"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.description }}</td>
              <td class="text-end text-nowrap">
                <RouterLink
                  :to="`/department-details/${item.id}`"
                  title="Details"
                  class="btn-outline theme-accent btn-sm me-1"
                  ><i class="bi bi-eye"></i
                ></RouterLink>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="border-bottom-0" colspan="3">
                Showing {{ filtered.length }} of {{ total }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
