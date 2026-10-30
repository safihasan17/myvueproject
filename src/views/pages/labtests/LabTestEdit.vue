<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import LabTestForm from "@/components/LabTestForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import {
  defaultLabTest,
  labTestToPayload,
  type LabTest,
} from "@/interfaces/LabTest";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<LabTest>({ ...defaultLabTest });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`lab-tests/${id}`)
  .then((res) => {
    const copy = {
      ...defaultLabTest,
      ...res.data.labTest,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultLabTest as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    data.value = copy as unknown as LabTest;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`lab-tests/${id}`, labTestToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Lab Test updated successfully");
        router.push("/lab-tests");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else
        message.value = {
          type: "danger",
          text: err.response?.data?.message ?? "Failed to update",
        };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Edit Lab Test" subtitle="Update this lab test">
    <RouterLink to="/lab-tests" class="btn-solid theme-accent"
      >Go to Lab Tests List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <LabTestForm
            :data="data"
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
    title="Update Lab Test"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this lab test?
  </ConfirmModal>
</template>
