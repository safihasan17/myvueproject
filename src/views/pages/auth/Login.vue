<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/components/AuthLayout.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { login } from "@/hooks/useAuth";
import { takeFlash } from "@/utils/flash";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<Record<string, string[] | undefined>>({});
// "Registration successful" arrives here after Sign Up
const message = ref<{ type: "success" | "danger"; text: string } | null>(
  takeFlash(),
);

async function submit() {
  loading.value = true;
  error.value = {};
  message.value = null;
  try {
    await login(email.value, password.value);
    router.push("/");
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
    intro="Welcome to your hospital management system. Sign in to manage patients, appointments, prescriptions and billing."
  >
    <div class="text-center mb-4">
      <p class="mb-3">
        <span class="auth-icon"><i class="bi bi-shield-lock"></i></span>
      </p>
      <h1 class="fw-bold mb-2 fs-xl">Sign In</h1>
      <p class="muted">
        Welcome, please sign in or
        <RouterLink to="/register">create an account</RouterLink>.
      </p>
    </div>

    <AlertMessage :message="message" @close="message = null" />

    <form @submit.prevent="submit" novalidate>
      <div class="mb-3">
        <input
          v-model="email"
          type="email"
          class="form-control auth-input"
          :class="{ 'is-invalid': error.email }"
          placeholder="Email"
          autocomplete="username"
        />
        <small class="fg-danger">{{ error.email?.[0] }}</small>
      </div>
      <div class="mb-3">
        <input
          v-model="password"
          type="password"
          class="form-control auth-input"
          :class="{ 'is-invalid': error.password }"
          placeholder="Password"
          autocomplete="current-password"
        />
        <small class="fg-danger">{{ error.password?.[0] }}</small>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <a href="#" class="small muted" @click.prevent>Forgot Password?</a>
        <button
          type="submit"
          class="btn-solid theme-accent"
          :disabled="loading"
        >
          <i class="bi bi-box-arrow-in-right me-1"></i>
          {{ loading ? "Signing in…" : "Sign In" }}
        </button>
      </div>
    </form>
  </AuthLayout>
</template>
