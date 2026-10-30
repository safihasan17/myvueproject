<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import MedicinePurchaseForm from "@/components/MedicinePurchaseForm.vue";
import { api } from "@/api";
import {
  defaultMedicinePurchase,
  type MedicinePurchase,
} from "@/interfaces/MedicinePurchase";

const data = ref<MedicinePurchase>({ ...defaultMedicinePurchase });
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
  data.value = { ...defaultMedicinePurchase };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("medicine-purchases", data.value)
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Purchase created successfully",
        );
        router.push("/purchases");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add purchase" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Purchase" subtitle="Create a new purchase record">
    <RouterLink to="/purchases" class="btn-solid theme-accent"
      >Go to Purchases List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <MedicinePurchaseForm
            :data="data"
            :error="error"
            submit-text="Add Purchase"
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
    title="Add Purchase"
    confirm-text="Add Purchase"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this purchase?
  </ConfirmModal>
</template>
