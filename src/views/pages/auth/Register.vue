<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/components/AuthLayout.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { register } from "@/hooks/useAuth";
import { setFlash } from "@/utils/flash";

const router = useRouter();
const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const terms = ref(false);
const loading = ref(false);
const error = ref<Record<string, string[] | undefined>>({});
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);
const termsDialog = ref<HTMLDialogElement | null>(null);

async function submit() {
  error.value = {};
  message.value = null;
  if (!terms.value) {
    message.value = {
      type: "danger",
      text: "Please accept the Terms & Conditions.",
    };
    return;
  }
  loading.value = true;
  try {
    const text = await register(form.value);
    setFlash(text);
    router.push("/login");
  } catch (err: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err.response?.status === 422)
      error.value = err.response.data.errors ?? {};
    else
      message.value = {
        type: "danger",
        text: err.response?.data?.message ?? "Could not reach the server",
      };
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthLayout
    flat
    intro="Creating a new account is quick and free. Get your access today in one easy step."
  >
    <div class="text-center mb-4">
      <p class="mb-3">
        <span class="auth-icon"><i class="bi bi-person-plus"></i></span>
      </p>
      <h1 class="fw-bold mb-2 fs-xl">Create Account</h1>
      <p class="muted">
        Already have an account? <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </div>

    <AlertMessage :message="message" @close="message = null" />

    <form @submit.prevent="submit" novalidate>
      <div class="mb-3">
        <input
          v-model="form.name"
          type="text"
          class="form-control auth-input"
          :class="{ 'is-invalid': error.name }"
          placeholder="Username"
          autocomplete="name"
        />
        <small class="fg-danger">{{ error.name?.[0] }}</small>
      </div>
      <div class="mb-3">
        <input
          v-model="form.email"
          type="email"
          class="form-control auth-input"
          :class="{ 'is-invalid': error.email }"
          placeholder="Email"
          autocomplete="email"
        />
        <small class="fg-danger">{{ error.email?.[0] }}</small>
      </div>
      <div class="mb-3">
        <input
          v-model="form.password"
          type="password"
          class="form-control auth-input"
          :class="{ 'is-invalid': error.password }"
          placeholder="Password"
          autocomplete="new-password"
        />
        <small class="fg-danger">{{ error.password?.[0] }}</small>
      </div>
      <div class="mb-3">
        <input
          v-model="form.password_confirmation"
          type="password"
          class="form-control auth-input"
          placeholder="Confirm Password"
          autocomplete="new-password"
        />
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"
      >
        <label class="d-flex align-items-center gap-2">
          <input v-model="terms" type="checkbox" /> I agree to Terms &amp;
          Conditions
        </label>
        <a href="#" class="small" @click.prevent="termsDialog?.showModal()"
          >View Terms</a
        >
      </div>
      <div class="text-center">
        <button
          type="submit"
          class="btn-solid theme-accent"
          :disabled="loading"
        >
          <i class="bi bi-plus-lg me-1"></i
          >{{ loading ? "Creating…" : "Sign Up" }}
        </button>
      </div>
    </form>

    <dialog ref="termsDialog" class="dialog">
      <div class="dialog-header">
        <h3 class="dialog-title">Terms &amp; Conditions</h3>
      </div>
      <div class="dialog-body">
        <p>
          By creating an account you agree to use this system only for
          authorised hospital work, to keep your password private and to handle
          patient information confidentially.
        </p>
        <p>
          Your administrator may disable an account at any time. Activity in the
          system may be logged for audit purposes.
        </p>
      </div>
      <div class="dialog-footer">
        <button
          type="button"
          class="btn-outline theme-secondary"
          @click="termsDialog?.close()"
        >
          Close
        </button>
        <button
          type="button"
          class="btn-solid theme-accent"
          @click="
            terms = true;
            termsDialog?.close();
          "
        >
          I Agree
        </button>
      </div>
    </dialog>
  </AuthLayout>
</template>
