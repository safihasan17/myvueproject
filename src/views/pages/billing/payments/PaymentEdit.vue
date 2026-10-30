<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import PaymentForm from "@/components/PaymentForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import { defaultPayment, type Payment } from "@/interfaces/Payment";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Payment>({ ...defaultPayment });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`payments/${id}`)
  .then((res) => {
    const copy = {
      ...defaultPayment,
      ...res.data.payment,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultPayment as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    copy.payment_date = onlyDate(copy.payment_date as string);
    data.value = copy as unknown as Payment;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`payments/${id}`, data.value)
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Payment updated successfully");
        router.push("/payments");
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
  <PageHead title="Edit Payment" subtitle="Update this payment">
    <RouterLink to="/payments" class="btn-solid theme-accent"
      >Go to Payments List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <PaymentForm
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
    title="Update Payment"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this payment?
  </ConfirmModal>
</template>
