import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./views/pages/Dashboard.vue";
import NotFound from "./views/pages/NotFound.vue";
import PatientManage from "./views/pages/patients/PatientManage.vue";
import PatientAdd from "./views/pages/patients/PatientAdd.vue";
import PatientEdit from "./views/pages/patients/PatientEdit.vue";
import PatientDetails from "./views/pages/patients/PatientDetails.vue";
import DoctorManage from "./views/pages/doctors/DoctorManage.vue";
import DoctorAdd from "./views/pages/doctors/DoctorAdd.vue";
import DoctorEdit from "./views/pages/doctors/DoctorEdit.vue";
import DoctorDetails from "./views/pages/doctors/DoctorDetails.vue";
import DepartmentManage from "./views/pages/departments/DepartmentManage.vue";
import DepartmentDetails from "./views/pages/departments/DepartmentDetails.vue";
import AppointmentManage from "./views/pages/appointments/AppointmentManage.vue";
import AppointmentAdd from "./views/pages/appointments/AppointmentAdd.vue";
import AppointmentEdit from "./views/pages/appointments/AppointmentEdit.vue";
import AppointmentDetails from "./views/pages/appointments/AppointmentDetails.vue";
import LabTestManage from "./views/pages/labtests/LabTestManage.vue";
import LabTestAdd from "./views/pages/labtests/LabTestAdd.vue";
import LabTestEdit from "./views/pages/labtests/LabTestEdit.vue";
import LabTestDetails from "./views/pages/labtests/LabTestDetails.vue";
import LabOrderManage from "./views/pages/labtests/LabOrderManage.vue";
import LabOrderAdd from "./views/pages/labtests/LabOrderAdd.vue";
import LabOrderEdit from "./views/pages/labtests/LabOrderEdit.vue";
import LabOrderDetails from "./views/pages/labtests/LabOrderDetails.vue";
import PrescriptionManage from "./views/pages/prescriptions/PrescriptionManage.vue";
import PrescriptionAdd from "./views/pages/prescriptions/PrescriptionAdd.vue";
import PrescriptionEdit from "./views/pages/prescriptions/PrescriptionEdit.vue";
import PrescriptionDetails from "./views/pages/prescriptions/PrescriptionDetails.vue";
import PrescriptionMedicineManage from "./views/pages/prescriptions/PrescriptionMedicineManage.vue";
import PrescriptionMedicineAdd from "./views/pages/prescriptions/PrescriptionMedicineAdd.vue";
import PrescriptionMedicineEdit from "./views/pages/prescriptions/PrescriptionMedicineEdit.vue";
import PrescriptionMedicineDetails from "./views/pages/prescriptions/PrescriptionMedicineDetails.vue";
import AdmissionManage from "./views/pages/inpatient/admissions/AdmissionManage.vue";
import AdmissionAdd from "./views/pages/inpatient/admissions/AdmissionAdd.vue";
import AdmissionEdit from "./views/pages/inpatient/admissions/AdmissionEdit.vue";
import AdmissionDetails from "./views/pages/inpatient/admissions/AdmissionDetails.vue";
import WardManage from "./views/pages/inpatient/wards/WardManage.vue";
import WardAdd from "./views/pages/inpatient/wards/WardAdd.vue";
import WardEdit from "./views/pages/inpatient/wards/WardEdit.vue";
import WardDetails from "./views/pages/inpatient/wards/WardDetails.vue";
import BedManage from "./views/pages/inpatient/beds/BedManage.vue";
import BedAdd from "./views/pages/inpatient/beds/BedAdd.vue";
import BedEdit from "./views/pages/inpatient/beds/BedEdit.vue";
import BedDetails from "./views/pages/inpatient/beds/BedDetails.vue";
import InvoiceManage from "./views/pages/billing/invoices/InvoiceManage.vue";
import InvoiceAdd from "./views/pages/billing/invoices/InvoiceAdd.vue";
import InvoiceEdit from "./views/pages/billing/invoices/InvoiceEdit.vue";
import InvoiceDetails from "./views/pages/billing/invoices/InvoiceDetails.vue";
import PaymentManage from "./views/pages/billing/payments/PaymentManage.vue";
import PaymentEdit from "./views/pages/billing/payments/PaymentEdit.vue";
import PaymentDetails from "./views/pages/billing/payments/PaymentDetails.vue";
import MedicineManage from "./views/pages/pharmacy/medicines/MedicineManage.vue";
import MedicineAdd from "./views/pages/pharmacy/medicines/MedicineAdd.vue";
import MedicineEdit from "./views/pages/pharmacy/medicines/MedicineEdit.vue";
import MedicineDetails from "./views/pages/pharmacy/medicines/MedicineDetails.vue";
import SupplierManage from "./views/pages/pharmacy/suppliers/SupplierManage.vue";
import SupplierAdd from "./views/pages/pharmacy/suppliers/SupplierAdd.vue";
import SupplierEdit from "./views/pages/pharmacy/suppliers/SupplierEdit.vue";
import SupplierDetails from "./views/pages/pharmacy/suppliers/SupplierDetails.vue";
import MedicinePurchaseManage from "./views/pages/pharmacy/purchases/MedicinePurchaseManage.vue";
import MedicinePurchaseAdd from "./views/pages/pharmacy/purchases/MedicinePurchaseAdd.vue";
import MedicinePurchaseEdit from "./views/pages/pharmacy/purchases/MedicinePurchaseEdit.vue";
import MedicinePurchaseDetails from "./views/pages/pharmacy/purchases/MedicinePurchaseDetails.vue";
import UserManage from "./views/pages/users/UserManage.vue";
import UserAdd from "./views/pages/users/UserAdd.vue";
import UserEdit from "./views/pages/users/UserEdit.vue";
import UserDetails from "./views/pages/users/UserDetails.vue";
import RoleManage from "./views/pages/roles/RoleManage.vue";
import RoleAdd from "./views/pages/roles/RoleAdd.vue";
import RoleEdit from "./views/pages/roles/RoleEdit.vue";
import Login from "./views/pages/auth/Login.vue";
import Register from "./views/pages/auth/Register.vue";
import { auth } from "./utils/auth";
import RoleDetails from "./views/pages/roles/RoleDetails.vue";

const routes = [
  { path: "/login", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },
  { path: "/", component: Dashboard },
  { path: "/patients", component: PatientManage },
  { path: "/add-patient", component: PatientAdd },
  { path: "/edit-patient/:id", component: PatientEdit },
  { path: "/patient-details/:id", component: PatientDetails },
  { path: "/doctors", component: DoctorManage },
  { path: "/add-doctor", component: DoctorAdd },
  { path: "/edit-doctor/:id", component: DoctorEdit },
  { path: "/doctor-details/:id", component: DoctorDetails },
  { path: "/departments", component: DepartmentManage },
  { path: "/department-details/:id", component: DepartmentDetails },
  { path: "/appointments", component: AppointmentManage },
  { path: "/add-appointment", component: AppointmentAdd },
  { path: "/edit-appointment/:id", component: AppointmentEdit },
  { path: "/appointment-details/:id", component: AppointmentDetails },
  { path: "/lab-tests", component: LabTestManage },
  { path: "/add-lab-test", component: LabTestAdd },
  { path: "/edit-lab-test/:id", component: LabTestEdit },
  { path: "/lab-test-details/:id", component: LabTestDetails },
  { path: "/lab-orders", component: LabOrderManage },
  { path: "/add-lab-order", component: LabOrderAdd },
  { path: "/edit-lab-order/:id", component: LabOrderEdit },
  { path: "/lab-order-details/:id", component: LabOrderDetails },
  { path: "/prescriptions", component: PrescriptionManage },
  { path: "/add-prescription", component: PrescriptionAdd },
  { path: "/edit-prescription/:id", component: PrescriptionEdit },
  { path: "/prescription-details/:id", component: PrescriptionDetails },
  { path: "/prescription-medicines", component: PrescriptionMedicineManage },
  { path: "/add-prescription-medicine", component: PrescriptionMedicineAdd },
  {
    path: "/edit-prescription-medicine/:id",
    component: PrescriptionMedicineEdit,
  },
  {
    path: "/prescription-medicine-details/:id",
    component: PrescriptionMedicineDetails,
  },
  { path: "/admissions", component: AdmissionManage },
  { path: "/add-admission", component: AdmissionAdd },
  { path: "/edit-admission/:id", component: AdmissionEdit },
  { path: "/admission-details/:id", component: AdmissionDetails },
  { path: "/wards", component: WardManage },
  { path: "/add-ward", component: WardAdd },
  { path: "/edit-ward/:id", component: WardEdit },
  { path: "/ward-details/:id", component: WardDetails },
  { path: "/beds", component: BedManage },
  { path: "/add-bed", component: BedAdd },
  { path: "/edit-bed/:id", component: BedEdit },
  { path: "/bed-details/:id", component: BedDetails },
  { path: "/invoices", component: InvoiceManage },
  { path: "/add-invoice", component: InvoiceAdd },
  { path: "/edit-invoice/:id", component: InvoiceEdit },
  { path: "/invoice-details/:id", component: InvoiceDetails },
  { path: "/payments", component: PaymentManage },
  { path: "/edit-payment/:id", component: PaymentEdit },
  { path: "/payment-details/:id", component: PaymentDetails },
  { path: "/medicines", component: MedicineManage },
  { path: "/add-medicine", component: MedicineAdd },
  { path: "/edit-medicine/:id", component: MedicineEdit },
  { path: "/medicine-details/:id", component: MedicineDetails },
  { path: "/suppliers", component: SupplierManage },
  { path: "/add-supplier", component: SupplierAdd },
  { path: "/edit-supplier/:id", component: SupplierEdit },
  { path: "/supplier-details/:id", component: SupplierDetails },
  { path: "/purchases", component: MedicinePurchaseManage },
  { path: "/add-purchase", component: MedicinePurchaseAdd },
  { path: "/edit-purchase/:id", component: MedicinePurchaseEdit },
  { path: "/purchase-details/:id", component: MedicinePurchaseDetails },
  { path: "/users", component: UserManage },
  { path: "/add-user", component: UserAdd },
  { path: "/users/:id/edit", component: UserEdit },
  { path: "/users/:id", component: UserDetails },
  { path: "/roles", component: RoleManage },
  { path: "/add-role", component: RoleAdd },
  { path: "/edit-role/:id", component: RoleEdit },
  { path: "/role-details/:id", component: RoleDetails },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// signed-out users only see /login and /register; signed-in users skip them
router.beforeEach((to) => {
  if (!to.meta.guest && !auth.token) return "/login";
  if (to.meta.guest && auth.token) return "/";
});
