<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import MedicinePurchaseForm from "@/components/MedicinePurchaseForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import {
  defaultMedicinePurchase,
  type MedicinePurchase,
} from "@/interfaces/MedicinePurchase";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<MedicinePurchase>({ ...defaultMedicinePurchase });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`medicine-purchases/${id}`)
  .then((res) => {
    const copy = {
      ...defaultMedicinePurchase,
      ...res.data.purchase,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultMedicinePurchase as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    copy.purchase_date = onlyDate(copy.purchase_date as string);
    data.value = copy as unknown as MedicinePurchase;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`medicine-purchases/${id}`, data.value)
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Purchase updated successfully");
        router.push("/purchases");
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
  <PageHead title="Edit Purchase" subtitle="Update this purchase">
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
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Purchase"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this purchase?
  </ConfirmModal>
</template>
