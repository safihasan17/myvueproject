<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import AppointmentForm from "@/components/AppointmentForm.vue";
import { api } from "@/api";
import {
  defaultAppointment,
  appointmentToPayload,
  type Appointment,
} from "@/interfaces/Appointment";

const data = ref<Appointment>({ ...defaultAppointment });
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
  data.value = { ...defaultAppointment };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("appointments", appointmentToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Appointment created successfully",
        );
        router.push("/appointments");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else
        message.value = { type: "danger", text: "Failed to add appointment" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Appointment" subtitle="Create a new appointment record">
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
            submit-text="Add Appointment"
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
    title="Add Appointment"
    confirm-text="Add Appointment"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this appointment?
  </ConfirmModal>
</template>
