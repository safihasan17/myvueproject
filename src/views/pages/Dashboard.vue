<script setup lang="ts">
const stats = [
  {
    label: "Patients",
    icon: "people",
    tone: "primary",
    value: "1,284",
    note: "registered patients",
  },
  {
    label: "Doctors",
    icon: "person-vcard",
    tone: "info",
    value: "42",
    note: "on staff",
  },
  {
    label: "Today's appointments",
    icon: "calendar-check",
    tone: "warning",
    value: "37",
    note: "scheduled for today",
  },
  {
    label: "Beds free",
    icon: "layout-sidebar",
    tone: "success",
    value: "18 / 60",
    note: "available / total",
  },
];

const money = [
  {
    label: "Collected this month",
    icon: "cash-stack",
    tone: "success",
    value: "৳5,42,300.00",
    note: "of billed",
    to: "/payments",
  },
  {
    label: "Billed this month",
    icon: "receipt",
    tone: "primary",
    value: "৳6,28,450.00",
    note: "Invoices raised this month",
    to: "/invoices",
  },
  {
    label: "Total due",
    icon: "exclamation-circle",
    tone: "danger",
    value: "৳86,150.00",
    note: "Unpaid balance on open invoices",
    to: "/invoices",
  },
];

const appointments = [
  {
    time: "10:30 AM",
    patient: "Rafiq Ahmed",
    doctor: "Dr. Nusrat Jahan",
    department: "Cardiology",
    status: "Checked-in",
    cls: "theme-primary",
  },
  {
    time: "11:00 AM",
    patient: "Farhana Akter",
    doctor: "Dr. Imran Kabir",
    department: "Orthopedics",
    status: "Waiting",
    cls: "theme-warning",
  },
  {
    time: "11:45 AM",
    patient: "Shakil Hossain",
    doctor: "Dr. Nusrat Jahan",
    department: "Cardiology",
    status: "Scheduled",
    cls: "theme-info",
  },
];

const wards = [
  { name: "Ward A — General", used: 15, total: 20 },
  { name: "Ward B — Cabin", used: 9, total: 15 },
  { name: "ICU", used: 9, total: 10 },
  { name: "Pediatric Ward", used: 9, total: 15 },
];
</script>

<template>
  <div class="page-head">
    <h1>Dashboard</h1>
    <span class="muted small">Hospital overview for today</span>
  </div>

  <div class="row g-3 mb-4">
    <div v-for="s in stats" :key="s.label" class="col-6 xl:col-3">
      <div class="card stat-card h-100">
        <div class="card-body d-flex align-items-center gap-3">
          <div :class="`stat-icon bg-subtle-${s.tone} fg-${s.tone}`">
            <i :class="`bi bi-${s.icon}`"></i>
          </div>
          <div>
            <div class="muted small">{{ s.label }}</div>
            <div class="fs-xl fw-bold">{{ s.value }}</div>
            <div class="muted small">{{ s.note }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-3 mb-4">
    <div v-for="c in money" :key="c.label" class="col-12 lg:col-4">
      <div class="card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="fs-xl fw-bold">{{ c.value }}</div>
              <div class="muted">{{ c.label }}</div>
            </div>
            <div :class="`stat-icon bg-subtle-${c.tone} fg-${c.tone}`">
              <i :class="`bi bi-${c.icon}`"></i>
            </div>
          </div>
          <div
            class="d-flex justify-content-between align-items-center small border-top pt-2 mt-3"
          >
            <span class="muted">{{ c.note }}</span>
            <RouterLink :to="c.to">View</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12 lg:col-8">
      <div class="card h-100">
        <div class="card-header bg-white fw-semibold d-flex">
          Today's appointments<RouterLink
            to="/appointments"
            class="ms-auto small fw-normal"
            >View all</RouterLink
          >
        </div>
        <div class="table-responsive">
          <table class="table table-hover mb-0 text-nowrap">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in appointments" :key="a.patient">
                <td>{{ a.time }}</td>
                <td>{{ a.patient }}</td>
                <td>{{ a.doctor }}</td>
                <td>{{ a.department }}</td>
                <td>
                  <span :class="`badge badge-subtle ${a.cls}`">{{
                    a.status
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-12 lg:col-4">
      <div class="card h-100">
        <div class="card-header bg-white fw-semibold d-flex">
          Ward occupancy<RouterLink to="/wards" class="ms-auto small fw-normal"
            >Wards</RouterLink
          >
        </div>
        <ul class="list-group list-group-flush">
          <li v-for="w in wards" :key="w.name" class="list-group-item">
            <div class="d-flex justify-content-between small mb-1">
              <span>{{ w.name }}</span
              ><span class="muted">{{ w.used }} / {{ w.total }}</span>
            </div>
            <div class="progress" style="height: 6px">
              <div
                class="progress-bar theme-accent"
                :style="{ width: (w.used / w.total) * 100 + '%' }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
