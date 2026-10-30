<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import MedicineForm from "@/components/MedicineForm.vue";
import { api } from "@/api";
import {
  defaultMedicine,
  medicineToPayload,
  type Medicine,
} from "@/interfaces/Medicine";

const data = ref<Medicine>({ ...defaultMedicine });
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
  data.value = { ...defaultMedicine };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("medicines", medicineToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Medicine created successfully",
        );
        router.push("/medicines");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add medicine" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Medicine" subtitle="Create a new medicine record">
    <RouterLink to="/medicines" class="btn-solid theme-accent"
      >Go to Medicines List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <MedicineForm
            :data="data"
            :error="error"
            submit-text="Add Medicine"
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
    title="Add Medicine"
    confirm-text="Add Medicine"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this medicine?
  </ConfirmModal>
</template>
