import { reactive, ref } from "vue";
import { api } from "@/api";
import type { Row } from "@/hooks/useList";

// Fetches an *options* endpoint (prescriptions/options, lab-test-orders/options, admissions/options)
export function useOptions(url: string, params: Row = {}) {
  const options = reactive<Record<string, Row[]>>({
    patients: [],
    doctors: [],
    appointments: [],
    medicines: [],
    labTests: [],
    wards: [],
    beds: [],
    admissions: [],
    suppliers: [],
  });
  const prescription = ref<Row | null>(null);
  const conflictId = ref<number | null>(null);
  const conflictMessage = ref("");

  api
    .get(url, { params })
    .then((res) => {
      for (const k of Object.keys(options)) options[k] = res.data[k] ?? [];
      prescription.value = res.data.prescription ?? null;
    })
    .catch((err) => {
      console.log(err);
      if (err.response?.status === 409) {
        conflictId.value = err.response.data.admission_id ?? null;
        conflictMessage.value = err.response.data.message ?? "";
      }
    });

  return { options, prescription, conflictId, conflictMessage };
}
