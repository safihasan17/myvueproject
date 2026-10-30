<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import InvoiceForm from "@/components/InvoiceForm.vue";
import { api } from "@/api";
import {
  defaultInvoice,
  invoiceToPayload,
  type Invoice,
} from "@/interfaces/Invoice";

const data = ref<Invoice>({ ...defaultInvoice });
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
  data.value = { ...defaultInvoice };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("invoices", invoiceToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Invoice created successfully",
        );
        router.push("/invoices");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add invoice" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Invoice" subtitle="Create a new invoice record">
    <RouterLink to="/invoices" class="btn-solid theme-accent"
      >Go to Invoices List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <InvoiceForm
            :data="data"
            :error="error"
            submit-text="Add Invoice"
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
    title="Add Invoice"
    confirm-text="Add Invoice"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this invoice?
  </ConfirmModal>
</template>
