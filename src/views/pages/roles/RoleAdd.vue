<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { setFlash } from "@/utils/flash";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import RoleForm from "@/components/RoleForm.vue";
import { api } from "@/api";
import { defaultRole, type Role } from "@/interfaces/Role";

const data = ref<Role>({ ...defaultRole });
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
  data.value = { ...defaultRole };
  error.value = {};
};

const confirmAdd = () => {
  api
    .post("roles", data.value)
    .then((res) => {
      if (res.data.success) {
        setFlash(
          typeof res.data.success === "string"
            ? res.data.success
            : "Role created successfully",
        );
        router.push("/roles");
      }
    })
    .catch((err) => {
      console.log(err.response?.data);
      if (err.response?.status === 422) error.value = err.response.data.errors;
      else message.value = { type: "danger", text: "Failed to add role" };
    })
    .finally(() => {
      showConfirm.value = false;
    });
};
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <PageHead title="Add Role" subtitle="Create a new role record">
    <RouterLink to="/roles" class="btn-solid theme-accent"
      >Go to Roles List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <RoleForm
            :data="data"
            :error="error"
            submit-text="Add Role"
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
    title="Add Role"
    confirm-text="Add Role"
    @confirm="confirmAdd"
    @close="showConfirm = false"
  >
    Are you sure you want to add this role?
  </ConfirmModal>
</template>
