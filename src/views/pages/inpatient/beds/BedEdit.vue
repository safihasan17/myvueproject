<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHead from "@/components/PageHead.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import BedForm from "@/components/BedForm.vue";
import { api } from "@/api";
import { setFlash } from "@/utils/flash";
import { defaultBed, bedToPayload, type Bed } from "@/interfaces/Bed";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const data = ref<Bed>({ ...defaultBed });
const error = ref<Record<string, string[] | undefined>>({});
const showConfirm = ref(false);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get(`beds/${id}`)
  .then((res) => {
    const copy = { ...defaultBed, ...res.data.bed } as unknown as Record<
      string,
      unknown
    >;
    // null values from the DB become "" for the form
    const def = defaultBed as unknown as Record<string, unknown>;
    for (const k of Object.keys(def))
      if (copy[k] === null || copy[k] === undefined) copy[k] = def[k];
    data.value = copy as unknown as Bed;
  })
  .catch((err) => {
    console.log(err);
  });

const handleSubmit = () => {
  showConfirm.value = true;
};

const confirmUpdate = () => {
  api
    .put(`beds/${id}`, bedToPayload(data.value))
    .then((res) => {
      if (res.data.success) {
        setFlash(res.data.message ?? "Bed updated successfully");
        router.push("/beds");
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
  <PageHead title="Edit Bed" subtitle="Update this bed">
    <RouterLink to="/beds" class="btn-solid theme-accent"
      >Go to Beds List</RouterLink
    >
  </PageHead>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body p-4">
          <BedForm
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
    title="Update Bed"
    confirm-text="Update"
    @confirm="confirmUpdate"
    @close="showConfirm = false"
  >
    Are you sure you want to update this bed?
  </ConfirmModal>
</template>
