<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import InvoiceForm from "@/components/InvoiceForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import {
  defaultInvoice,
  invoiceToPayloadEdit,
  type Invoice,
} from "@/interfaces/Invoice";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Invoice>({ ...defaultInvoice });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`invoices/${id}`)
  .then((res) => {
    const copy = {
      ...defaultInvoice,
      ...res.data.invoice,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultInvoice as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    copy.invoice_date = onlyDate(copy.invoice_date as string);
    copy.admission_id = copy.admission_id ?? "";
    copy.appointment_id = copy.appointment_id ?? "";
    copy.status = copy.status === "Cancelled" ? "Cancelled" : "Active";
    data.value = copy as unknown as Invoice;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`invoices/${id}`, invoiceToPayloadEdit(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Invoice updated successfully");
        router.push("/invoices");
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
  <PageHead title="Edit Invoice" subtitle="Update this invoice">
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
            is-edit
            :invoice-id="String(id)"
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Invoice"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this invoice?
  </ConfirmModal>
</template>
