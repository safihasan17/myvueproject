// status text -> badge theme (badge badge-subtle theme-*)
const map: Record<string, string> = {
  Completed: "success",
  Discharged: "success",
  Available: "success",
  Cancelled: "danger",
  Occupied: "danger",
  Unpaid: "danger",
  Failed: "danger",
  Paid: "success",
  Success: "success",
  "Partially Paid": "warning",
  Waiting: "warning",
  Pending: "warning",
  Admitted: "warning",
  Reserved: "warning",
  "Checked-in": "info",
  "In Progress": "info",
  Transferred: "info",
  Scheduled: "primary",
  Maintenance: "secondary",
};
export const badgeClass = (status?: string | null) =>
  `badge badge-subtle theme-${map[status ?? ""] ?? "secondary"}`;
