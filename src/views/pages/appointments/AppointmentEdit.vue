<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import AppointmentForm from "@/components/AppointmentForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { onlyDate } from "@/utils/format";
import {
  defaultAppointment,
  appointmentToPayload,
  formatTime,
  type Appointment,
} from "@/interfaces/Appointment";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Appointment>({ ...defaultAppointment });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`appointments/${id}`)
  .then((res) => {
    const copy = {
      ...defaultAppointment,
      ...res.data.appointment,
    } as unknown as Record<string, unknown>;
    // null values from the DB become "" for the form
    const def = defaultAppointment as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    copy.appointment_date = onlyDate(copy.appointment_date as string);
    copy.appointment_time = formatTime(copy.appointment_time as string);
    data.value = copy as unknown as Appointment;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`appointments/${id}`, appointmentToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Appointment updated successfully");
        router.push("/appointments");
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
  <PageHead title="Edit Appointment" subtitle="Update this appointment">
    <RouterLink to="/appointments" class="btn-solid theme-accent"
      >Go to Appointments List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <AppointmentForm
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
    title="Update Appointment"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this appointment?
  </ConfirmModal>
</template>
