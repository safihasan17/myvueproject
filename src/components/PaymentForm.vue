<script setup lang="ts">
import { paymentMethods, type Payment } from "@/interfaces/Payment";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";

defineProps<{
  data: Payment;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const staticOpts_payment_method = (
  [...paymentMethods] as readonly string[]
).map((s) => ({ value: s, label: s }));
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormInput
        v-model="data.amount"
        label="Amount"
        name="amount"
        :error="error.amount"
        type="number"
        step="0.01"
      />
      <FormSelect
        v-model="data.payment_method"
        label="Method"
        name="payment_method"
        :error="error.payment_method"
        placeholder="Select…"
        :options="staticOpts_payment_method"
      />
      <FormInput
        v-model="data.payment_date"
        label="Payment date"
        name="payment_date"
        :error="error.payment_date"
        type="date"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
