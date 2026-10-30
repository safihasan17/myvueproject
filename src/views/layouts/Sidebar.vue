<script setup lang="ts">
type Item = { to: string; label: string; icon: string; end?: boolean };
const groups: { title: string; items: Item[] }[] = [
  {
    title: "",
    items: [{ to: "/", label: "Dashboard", icon: "speedometer2", end: true }],
  },
  {
    title: "Clinic",
    items: [
      { to: "/patients", label: "Patients", icon: "people" },
      { to: "/doctors", label: "Doctors", icon: "person-vcard" },
      { to: "/departments", label: "Departments", icon: "diagram-3" },
      { to: "/appointments", label: "Appointments", icon: "calendar-check" },
      { to: "/lab-tests", label: "Lab Tests", icon: "eyedropper" },
      { to: "/lab-orders", label: "Lab Orders", icon: "clipboard2-pulse" },
      { to: "/prescriptions", label: "Prescriptions", icon: "file-medical" },
      {
        to: "/prescription-medicines",
        label: "Rx Medicines",
        icon: "card-list",
      },
    ],
  },
  {
    title: "Inpatient",
    items: [
      { to: "/admissions", label: "Admissions", icon: "box-arrow-in-right" },
      { to: "/wards", label: "Wards", icon: "building" },
      { to: "/beds", label: "Beds", icon: "layout-sidebar" },
    ],
  },
  {
    title: "Billing",
    items: [
      { to: "/invoices", label: "Invoices", icon: "receipt" },
      { to: "/payments", label: "Payments", icon: "cash-coin" },
    ],
  },
  {
    title: "Pharmacy",
    items: [
      { to: "/medicines", label: "Medicines", icon: "capsule" },
      { to: "/suppliers", label: "Suppliers", icon: "truck" },
      { to: "/purchases", label: "Purchases", icon: "cart-plus" },
    ],
  },
  {
    title: "Administration",
    items: [
      { to: "/users", label: "Users", icon: "person-badge" },
      { to: "/roles", label: "Roles", icon: "shield-lock" },
    ],
  },
];
</script>

<template>
  <nav class="app-sidebar" aria-label="Main navigation">
    <div class="brand">
      <i class="bi bi-hospital-fill"></i><span>Hospital MS</span>
    </div>
    <div v-for="g in groups" :key="g.title || 'top'" class="mb-2">
      <div v-if="g.title" class="nav-group">{{ g.title }}</div>
      <ul class="side-list">
        <li v-for="l in g.items" :key="l.to">
          <RouterLink
            :to="l.to"
            class="side-link"
            :class="{
              active: l.end
                ? $route.path === l.to
                : $route.path.startsWith(l.to),
            }"
          >
            <i :class="`bi bi-${l.icon}`"></i>{{ l.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
