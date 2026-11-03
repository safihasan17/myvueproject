<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "@/api";
import Loader from "@/components/Loader.vue";
import AlertMessage from "@/components/AlertMessage.vue";
import { badgeClass } from "@/utils/badge";

interface DashboardData {
  stats: {
    totalPatients: number;
    totalDoctors: number;
    todayAppointmentsCount: number;
    totalBeds: number;
    availableBeds: number;
  };
  money: {
    monthBilled: number;
    monthCollected: number;
    collectedPercent: number;
    totalDue: number;
  };
  wards: {
    id: number;
    name: string;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
  }[];
  todayAppointments: {
    id: number;
    appointment_time: string;
    status: string;
    patient?: { name: string } | null;
    doctor?: {
      user?: { name: string } | null;
      department?: { name: string } | null;
    } | null;
  }[];
}

const loading = ref(true);
const data = ref<DashboardData | null>(null);
const message = ref<{ type: "success" | "danger"; text: string } | null>(null);

api
  .get("dashboard")
  .then((res) => {
    data.value = res.data;
  })
  .catch((err) => {
    console.log(err);
    message.value = {
      type: "danger",
      text: err.response?.data?.message ?? "Failed to load dashboard",
    };
  })
  .finally(() => {
    loading.value = false;
  });

// 542300 -> "৳5,42,300"  (Indian lakh/crore grouping, ".00" dropped)
const taka = (n: number) =>
  "৳" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// "09:30:00" -> "9:30 AM"
const fmtTime = (t?: string | null) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const stats = computed(() => {
  const s = data.value?.stats;
  return [
    {
      label: "Patients",
      icon: "people",
      tone: "primary",
      value: (s?.totalPatients ?? 0).toLocaleString("en-IN"),
      note: "registered patients",
    },
    {
      label: "Doctors",
      icon: "person-vcard",
      tone: "info",
      value: (s?.totalDoctors ?? 0).toLocaleString("en-IN"),
      note: "on staff",
    },
    {
      label: "Today's appointments",
      icon: "calendar-check",
      tone: "warning",
      value: (s?.todayAppointmentsCount ?? 0).toLocaleString("en-IN"),
      note: "scheduled for today",
    },
    {
      label: "Beds free",
      icon: "layout-sidebar",
      tone: "success",
      value: `${s?.availableBeds ?? 0} / ${s?.totalBeds ?? 0}`,
      note: "available / total",
    },
  ];
});

const money = computed(() => {
  const m = data.value?.money;
  return [
    {
      label: "Collected this month",
      icon: "cash-stack",
      tone: "success",
      value: taka(m?.monthCollected ?? 0),
      note: `${m?.collectedPercent ?? 0}% of billed`,
      to: "/payments",
    },
    {
      label: "Billed this month",
      icon: "receipt",
      tone: "primary",
      value: taka(m?.monthBilled ?? 0),
      note: "Invoices raised this month",
      to: "/invoices",
    },
    {
      label: "Total due",
      icon: "exclamation-circle",
      tone: "danger",
      value: taka(m?.totalDue ?? 0),
      note: "Unpaid balance on open invoices",
      to: "/invoices",
    },
  ];
});

const appointments = computed(() => data.value?.todayAppointments ?? []);
const wards = computed(() => data.value?.wards ?? []);
</script>

<template>
  <AlertMessage :message="message" @close="message = null" />
  <div class="page-head">
    <h1>Dashboard</h1>
    <span class="muted small">Hospital overview for today</span>
  </div>

  <div v-if="loading" class="text-center py-5"><Loader /></div>
  <template v-else-if="data">

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
                <tr v-if="appointments.length === 0">
                  <td colspan="5" class="text-center muted py-4">
                    No appointments today.
                  </td>
                </tr>
                <tr v-for="a in appointments" :key="a.id">
                  <td>{{ fmtTime(a.appointment_time) }}</td>
                  <td>{{ a.patient?.name }}</td>
                  <td>Dr. {{ a.doctor?.user?.name }}</td>
                  <td>{{ a.doctor?.department?.name }}</td>
                  <td>
                    <span :class="badgeClass(a.status)">{{ a.status }}</span>
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
            <li
              v-if="wards.length === 0"
              class="list-group-item muted text-center py-4"
            >
              No wards yet.
            </li>
            <li v-for="w in wards" :key="w.id" class="list-group-item">
              <div class="d-flex justify-content-between small mb-1">
                <span>{{ w.name }}</span
                ><span class="muted"
                  >{{ w.occupied_beds }} / {{ w.total_beds }}</span
                >
              </div>
              <div class="progress" style="height: 6px">
                <div
                  class="progress-bar theme-accent"
                  :style="{
                    width:
                      (w.total_beds ? (w.occupied_beds / w.total_beds) * 100 : 0) +
                      '%',
                  }"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </template>
</template>