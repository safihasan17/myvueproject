<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import SupplierForm from "@/components/SupplierForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { defaultSupplier, type Supplier } from "@/interfaces/Supplier";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Supplier>({ ...defaultSupplier });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`suppliers/${id}`)
  .then((res) => {
    const copy = {
      ...defaultSupplier,
      ...res.data.supplier,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultSupplier as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    data.value = copy as unknown as Supplier;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`suppliers/${id}`, data.value)
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Supplier updated successfully");
        router.push("/suppliers");
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
  <PageHead title="Edit Supplier" subtitle="Update this supplier">
    <RouterLink to="/suppliers" class="btn-solid theme-accent"
      >Go to Suppliers List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <SupplierForm
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
    title="Update Supplier"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this supplier?
  </ConfirmModal>
</template>
