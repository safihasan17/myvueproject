<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AdmissionForm from "@/components/AdmissionForm.vue";
import { api } from "@/api";
import {
  emptyAdmission,
  admissionToUpdatePayload,
  type Admission,
} from "@/interfaces/Admission";
import { toInputDateTime } from "@/utils/format";
import { useOptions } from "@/hooks/useOptions";
import { setFlash } from "@/utils/flash";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

// the current bed stays in the list while editing
const { options } = useOptions("admissions/options", { admission_id: id });
const data = ref<Admission>(emptyAdmission());
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);

api
  .get(`admissions/${id}`)
  .then((res) => {
    const a = res.data.admission;
    data.value = {
      ...emptyAdmission(),
      ...a,
      admission_date: toInputDateTime(a.admission_date),
      discharge_date: toInputDateTime(a.discharge_date),
    };
  })
  .catch((err) => console.log(err));

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`admissions/${id}`, admissionToUpdatePayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Admission updated successfully");
        router.push("/admissions");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422)
        error.value = err.response.data.errors ?? {};
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <PageHead title="Edit Admission" subtitle="Update this admission">
    <RouterLink to="/admissions" class="btn-solid theme-accent"
      >Go to Admissions List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <AdmissionForm
            :data="data"
            :options="options"
            :error="error"
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Admission"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this admission?
  </ConfirmModal>
</template>
