<script setup lang="ts">
import { computed } from "vue";
import { bedStatuses, type Bed } from "@/interfaces/Bed";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import FormActions from "@/components/FormActions.vue";
import { useList } from "@/hooks/useList";

defineProps<{
  data: Bed;
  error: Record<string, string[] | undefined>;
  submitText?: string;
  showClear?: boolean;
}>();
defineEmits<{ (e: "submit"): void; (e: "clear"): void }>();

const wards = useList("wards", "wards");
const wardsOptions = computed(() =>
  wards.value.map((o) => ({ value: o.id as number, label: String(o.name) })),
);
const staticOpts_status = ([...bedStatuses] as readonly string[]).map((s) => ({
  value: s,
  label: s,
}));
</script>

<template>
  <form @submit.prevent="$emit('submit')">
    <div class="row">
      <FormSelect
        v-model="data.ward_id"
        label="Ward"
        name="ward_id"
        :error="error.ward_id"
        placeholder="Select…"
        :options="wardsOptions"
      />
      <FormInput
        v-model="data.bed_number"
        label="Bed number"
        name="bed_number"
        :error="error.bed_number"
      />
      <FormSelect
        v-model="data.status"
        label="Status"
        name="status"
        :error="error.status"
        placeholder="Select…"
        :options="staticOpts_status"
      />
    </div>
    <FormActions
      :submit-text="submitText"
      :show-clear="showClear"
      @clear="$emit('clear')"
    />
  </form>
</template>
