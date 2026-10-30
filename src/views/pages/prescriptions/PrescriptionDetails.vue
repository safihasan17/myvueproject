<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { api } from "@/api";
import { formatTime } from "@/interfaces/Appointment";
import { onlyDate } from "@/utils/format";
import type { Prescription } from "@/interfaces/Prescription";

const id = useRoute().params.id;
const p = ref<Prescription | null>(null);

api
  .get(`prescriptions/${id}`)
  .then((res) => {
    p.value = res.data.prescription;
  })
  .catch((err) => {
    console.log(err);
  });

const router = useRouter();
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const generateInvoice = () => {
  api
    .post(`prescriptions/${id}/generate-invoice`)
    .then((res) => router.push(`/invoice-details/${res.data.invoice_id}`))
    .catch((err) => {
      message.value = { type: "danger", text: err.response?.data?.message ?? "Failed to generate invoice" };
    });
};

const rx = (n: number) => `RX-${String(n).padStart(4, "0")}`;
function print() {
  window.print();
}
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Prescription" subtitle="Prescription details">
    <button type="button" class="btn-outline theme-secondary" @click="generateInvoice"><i class="bi bi-receipt"></i> Generate invoice</button>
    <RouterLink :to="`/edit-prescription/${id}`" class="btn-outline theme-accent"><i class="bi bi-pencil"></i> Edit</RouterLink>
    <RouterLink v-if="p && p.admission_advised && !p.admission" :to="`/add-admission?prescription_id=${id}`" class="btn-outline theme-secondary"><i class="bi bi-hospital"></i> Admit</RouterLink>
    <button type="button" class="btn-outline theme-secondary" @click="print"><i class="bi bi-printer"></i> Print</button>
    <RouterLink to="/prescriptions" class="btn-solid theme-accent">Go to Prescriptions List</RouterLink>
  </PageHead>

  <div v-if="p" class="bg-white border rounded mx-auto p-4" style="max-width: 800px">
    <div class="d-flex justify-content-between align-items-start pb-3 border-bottom border-dark">
      <div style="font-family: Georgia, 'Times New Roman', serif; font-weight: 700; color: #2c3e50; line-height: 1">
        <span style="font-size: 4.5rem">R</span><span style="font-size: 2.5rem">x</span>
      </div>
      <div class="text-end">
        <div class="fw-bold fs-lg" style="color: #2c3e50">{{ p.doctor?.user?.name }}</div>
        <div>{{ p.doctor?.department?.name }}</div>
        <div class="small muted">{{ p.doctor?.user?.email }}</div>
      </div>
    </div>

    <div class="row g-3 py-3">
      <div class="col-7">
        <div class="small text-uppercase muted">Patient Details</div>
        <div class="fw-semibold">{{ p.patient?.name }}</div>
        <div v-if="p.patient?.phone"><span class="small text-uppercase muted">Ph No.: </span>{{ p.patient.phone }}</div>
        <div class="mt-3 small text-uppercase muted">Notes / Diagnosis:</div>
        <div style="white-space: pre-line">{{ p.notes || "—" }}</div>
      </div>
      <div class="col-5">
        <div><span class="small text-uppercase muted">Ref no: </span><strong>{{ rx(p.id) }}</strong></div>
        <div><span class="small text-uppercase muted">Date: </span><strong>{{ onlyDate(p.prescription_date) }}</strong></div>
        <div v-if="p.appointment">
          <span class="small text-uppercase muted">Appointment: </span><strong>#{{ p.appointment.id }} ({{ onlyDate(p.appointment.appointment_date) }}{{ "appointment_time" in p.appointment ? " " + formatTime(String((p.appointment as Record<string, unknown>).appointment_time ?? "")) : "" }})</strong>
        </div>
        <div v-if="p.admission_advised"><span class="badge badge-subtle theme-warning">Admission advised</span></div>
      </div>
    </div>

    <div class="border-top border-bottom border-dark">
      <div class="row g-0">
        <div class="col-4 text-center py-2 small text-uppercase">Lab Tests</div>
        <div class="col-8 text-center py-2 small text-uppercase border-start border-dark">Medicines</div>
      </div>
    </div>
    <div class="row g-0" style="min-height: 320px">
      <div class="col-4 p-3">
        <ol class="ps-3 mb-0">
          <li v-for="o in p.lab_test_orders ?? []" :key="o.id">
            {{ o.test?.test_name }} <span class="small muted">({{ o.status }})</span>
          </li>
        </ol>
        <div v-if="!(p.lab_test_orders ?? []).length" class="muted small">—</div>
      </div>
      <div class="col-8 p-3 border-start border-dark">
        <table class="table table-sm table-borderless mb-0">
          <thead>
            <tr class="small muted"><th>Medicine</th><th>Dosage</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in p.prescription_medicines ?? []" :key="r.id">
              <td>
                {{ r.medicine?.name }}
                <div v-if="r.instructions" class="small muted">{{ r.instructions }}</div>
              </td>
              <td>{{ r.dosage }}</td>
              <td>{{ r.duration }}</td>
            </tr>
            <tr v-if="!(p.prescription_medicines ?? []).length"><td colspan="3" class="muted small">—</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
