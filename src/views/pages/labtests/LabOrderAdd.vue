<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import LabOrderForm from "@/components/LabOrderForm.vue";
import { api } from "@/api";
import {
  emptyLabOrder,
  labOrderToCreatePayload,
  type LabOrder,
} from "@/interfaces/LabOrder";

const data = ref<LabOrder>({ ...emptyLabOrder() });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const router = useRouter();

watch(message, (m) => {
  if (m) setTimeout(() => (message.value = null), 3000);
});

// submitting the form only opens the confirm modal
const handleSubmit = () => {
  showConfirm.value = true;
};

const handleClear = () => {
  data.value = { ...emptyLabOrder() };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("lab-test-orders", labOrderToCreatePayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Lab Order created successfully",
        );
        router.push("/lab-orders");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add lab order" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Lab Order" subtitle="Create a new lab order record">
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
            submit-text="Add Lab Order"
            show-clear
            @submit="handleSubmit"
            @clear="handleClear"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Add Lab Order"
    confirm-text="Add Lab Order"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this lab order?
  </ConfirmModal>
</template>
