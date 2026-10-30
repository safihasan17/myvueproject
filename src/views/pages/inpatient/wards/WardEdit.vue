<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import WardForm from "@/components/WardForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { defaultWard, wardToPayload, type Ward } from "@/interfaces/Ward";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Ward>({ ...defaultWard });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`wards/${id}`)
  .then((res) => {
    const copy = { ...defaultWard, ...res.data.ward } as unknown as Record<
      string,
      unknown
    >;
    // null values from the DB become "" for the form
    const def = defaultWard as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    data.value = copy as unknown as Ward;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`wards/${id}`, wardToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Ward updated successfully");
        router.push("/wards");
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
  <PageHead title="Edit Ward" subtitle="Update this ward">
    <RouterLink to="/wards" class="btn-solid theme-accent"
      >Go to Wards List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <WardForm
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
    title="Update Ward"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this ward?
  </ConfirmModal>
</template>
