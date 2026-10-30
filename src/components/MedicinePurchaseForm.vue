<script setup lang="ts">
import { computed } from "vue";
import type { MedicinePurchase } from "@/interfaces/MedicinePurchase";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";
import { useList } from "@/hooks/useList";

defineProps<{
  data: MedicinePurchase;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const suppliers = useList("medicine-purchases/options", "suppliers");
const suppliersOptions = computed(() =>
  suppliers.value.map((o) => ({
    value: o.id as number,
    label: String(o.name),
  })),
);
const medicines = useList("medicine-purchases/options", "medicines");
const medicinesOptions = computed(() =>
  medicines.value.map((o) => ({
    value: o.id as number,
    label: String(o.name),
  })),
);
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.supplier_id"
        label="Supplier"
        name="supplier_id"
        :error="error.supplier_id"
        placeholder="Select…"
        :options="suppliersOptions"
      />
      <FormSelect
        v-model="data.medicine_id"
        label="Medicine"
        name="medicine_id"
        :error="error.medicine_id"
        placeholder="Select…"
        :options="medicinesOptions"
      />
      <FormInput
        v-model="data.quantity"
        label="Quantity"
        name="quantity"
        :error="error.quantity"
        type="number"
        min="1"
      />
      <FormInput
        v-model="data.purchase_price"
        label="Purchase price (per unit)"
        name="purchase_price"
        :error="error.purchase_price"
        type="number"
        step="0.01"
      />
      <FormInput
        v-model="data.purchase_date"
        label="Purchase date"
        name="purchase_date"
        :error="error.purchase_date"
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
