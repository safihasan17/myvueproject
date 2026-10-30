<script setup lang="ts">
import { ref, watch } from "vue";

// Two modes:
//  - controlled:  <ConfirmModal :show="x" @confirm=".." @close=".." />   (used by API pages)
//  - static:      <ConfirmModal id="confirm-delete" />  opened with data-bs-toggle="dialog"
const props = withDefaults(
  defineProps<{
    show?: boolean;
    id?: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: string;
  }>(),
  {
    title: "Confirm",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "accent",
  },
);
const emit = defineEmits<{ (e: "confirm"): void; (e: "close"): void }>();

const dlg = ref<HTMLDialogElement | null>(null);
watch(
  () => props.show,
  (v) => {
    const d = dlg.value;
    if (!d) return;
    if (v && !d.open) d.showModal();
    if (!v && d.open) d.close();
  },
);
</script>

<template>
  <dialog
    ref="dlg"
    :id="id"
    class="dialog"
    tabindex="-1"
    @close="emit('close')"
  >
    <div class="dialog-header">
      <h5 class="dialog-title">{{ title }}</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        :data-bs-dismiss="show === undefined ? 'dialog' : undefined"
        @click="emit('close')"
      ></button>
    </div>
    <div class="dialog-body"><slot /></div>
    <div class="dialog-footer">
      <button
        type="button"
        class="btn-outline theme-secondary"
        :data-bs-dismiss="show === undefined ? 'dialog' : undefined"
        @click="emit('close')"
      >
        {{ cancelText }}
      </button>
      <button
        type="button"
        :class="`btn-solid theme-${confirmVariant}`"
        :data-bs-dismiss="show === undefined ? 'dialog' : undefined"
        @click="emit('confirm')"
      >
        {{ confirmText }}
      </button>
    </div>
  </dialog>
</template>
