<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import LabOrderForm from "@/components/LabOrderForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import {
  emptyLabOrder,
  labOrderToUpdatePayload,
  type LabOrder,
} from "@/interfaces/LabOrder";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<LabOrder>({ ...emptyLabOrder() });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`lab-test-orders/${id}`)
  .then((res) => {
    const copy = {
      ...emptyLabOrder(),
      ...res.data.labTestOrder,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = emptyLabOrder() as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    copy.order_date = onlyDate(copy.order_date as string);
    data.value = copy as unknown as LabOrder;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`lab-test-orders/${id}`, labOrderToUpdatePayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Lab Order updated successfully");
        router.push("/lab-orders");
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
  <PageHead title="Edit Lab Order" subtitle="Update this lab order">
    <RouterLink to="/lab-orders" class="btn-solid theme-accent"
      >Go to Lab Orders List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <LabOrderForm
            :data="data"
            :error="error"
            is-edit
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Lab Order"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this lab order?
  </ConfirmModal>
</template>
