<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import DoctorForm from "@/components/DoctorForm.vue";
import { api } from "@/api";
import {
  defaultDoctor,
  doctorToFormData,
  errorDoctor,
  type Doctor,
  type DoctorError,
} from "@/interfaces/Doctor";
import { useDoctorOptions } from "@/hooks/useDoctorOptions";

const router = useRouter();
const { users, departments } = useDoctorOptions();
const doctor = ref<Doctor>({ ...defaultDoctor });
const error = ref<DoctorError>({ ...errorDoctor });
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

// hide the message after a few seconds
watch(message, (m) => {
  if (m)
    setTimeout(() => {
      message.value = null;
    }, 3000);
});

// submitting the form only opens the confirm modal
const handleSubmit = () => {
  showConfirm.value = true;
};

const handleClear = () => {
  doctor.value = { ...defaultDoctor };
  error.value = { ...errorDoctor };
};

// the real API call happens when the modal's "Add Doctor" button is clicked
const confirmAdd = () => {
  api
    .post("doctors", doctorToFormData(doctor.value), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.success);
        router.push("/doctors");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add doctor" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Doctor" subtitle="Create a new doctor record">
    <RouterLink to="/doctors" class="btn-solid theme-accent"
      >Go to Doctors List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <DoctorForm
            :data="doctor"
            :users="users"
            :departments="departments"
            :error="error"
            submit-text="Add Doctor"
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
    title="Add Doctor"
    confirm-text="Add Doctor"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this doctor?
  </ConfirmModal>
</template>
