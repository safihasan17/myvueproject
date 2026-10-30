<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import DoctorForm from "@/components/DoctorForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import {
  defaultDoctor,
  doctorToFormData,
  errorDoctor,
  type Doctor,
  type DoctorError,
} from "@/interfaces/Doctor";
import { useDoctorOptions } from "@/hooks/useDoctorOptions";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const { users, departments } = useDoctorOptions();
const doctor = ref<Doctor>({ ...defaultDoctor });
const error = ref<DoctorError>({ ...errorDoctor });
const showConfirm = ref(false);

const getItem = () => {
  api
    .get(`doctors/${id}`)
    .then((res) => {
      const d = res.data.doctor;
      // null values from the DB become "" for the form
      doctor.value = {
        ...defaultDoctor,
        ...d,
        department_id: d.department_id ?? "",
        specialization: d.specialization ?? "",
        qualification: d.qualification ?? "",
        consultation_fee: d.consultation_fee ?? "",
        image: d.image ?? null,
      };
    })
    .catch((err) => {
      console.log(err);
    });
};
getItem();

const handleSubmit = () => {
  showConfirm.value = true;
};

// files need POST + _method=PUT (Laravel does not read files from a real PUT)
const confirmUpdate = () => {
  api
    .post(`doctors/${id}`, doctorToFormData(doctor.value, "PUT"), {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.success) {
        showConfirm.value = false;
        error.value = { ...errorDoctor };
        setFlash(res.data.message ?? "Doctor updated successfully");
        router.push("/doctors");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <PageHead title="Edit Doctor" subtitle="Update this doctor">
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
            submit-text="Save changes"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    title="Update Doctor"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this doctor?
  </ConfirmModal>
</template>
