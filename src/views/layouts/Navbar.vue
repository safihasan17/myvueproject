<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth, logout } from "@/hooks/useAuth";

defineEmits<{ (e: "toggle-sidebar"): void }>();

const router = useRouter();
const userName = computed(() => auth.user?.name ?? "User");
const initials = computed(() =>
  userName.value
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase(),
);
async function handleLogout() {
  await logout();
  router.push("/login");
}

// dark mode: toggles data-bs-theme on <html> and remembers the choice
function setTheme(dark: boolean) {
  document.documentElement.setAttribute(
    "data-bs-theme",
    dark ? "dark" : "light",
  );
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    /* storage unavailable */
  }
}
function toggleTheme() {
  setTheme(document.documentElement.getAttribute("data-bs-theme") !== "dark");
}
onMounted(() => {
  try {
    if (localStorage.getItem("theme") === "dark") setTheme(true);
  } catch {
    /* storage unavailable */
  }
});
</script>

<template>
  <header class="app-navbar">
    <button
      class="btn-icon lg:d-none"
      type="button"
      aria-label="Toggle menu"
      @click="$emit('toggle-sidebar')"
    >
      <i class="bi bi-list fs-xl"></i>
    </button>

    <div class="topbar-right">
      <button
        type="button"
        class="btn-icon"
        aria-label="Toggle dark mode"
        @click="toggleTheme"
      >
        <i class="bi bi-moon-stars"></i>
      </button>

      <!-- Bootstrap Menu plugin -->
      <div>
        <button
          type="button"
          class="btn-text user-btn"
          data-bs-toggle="menu"
          aria-expanded="false"
        >
          <span class="user-badge">{{ initials }}</span>
          <span class="d-none sm:d-inline">{{ userName }}</span>
        </button>
        <div class="menu">
          <a class="menu-item" href="#" @click.prevent>Profile</a>
          <a class="menu-item" href="#" @click.prevent>Settings</a>
          <div class="menu-divider"></div>
          <a class="menu-item" href="#" @click.prevent="handleLogout">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>
