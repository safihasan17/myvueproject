import { todayLocal } from "@/utils/format";

export const invoiceStatuses = [
  "Unpaid",
  "Partially Paid",
  "Paid",
  "Cancelled",
] as const;

export interface InvoiceItem {
  id: number;
  item_type: string;
  description: string;
  amount: number | string;
}

export interface Invoice {
  id: number;
  patient_id: number | "";
  admission_id: number | "";
  appointment_id: number | "";
  total_amount: number | string;
  paid_amount?: number | string;
  invoice_date: string;
  status: string; // form: "Active" | "Cancelled"
  patient?: {
    id: number;
    name: string;
    phone?: string | null;
    address?: string | null;
  };
  admission?: {
    id: number;
    status?: string;
    ward?: { name: string } | null;
    bed?: { bed_number: string } | null;
  } | null;
  appointment?: {
    id: number;
    appointment_date: string;
    doctor?: { user?: { name: string } } | null;
  } | null;
  items?: InvoiceItem[];
  payments?: {
    id: number;
    amount: number | string;
    payment_method: string;
    payment_date: string;
    status: string;
    receiver?: { name: string } | null;
  }[];
}

export const emptyInvoice = (): Invoice => ({
  id: 0,
  patient_id: "",
  admission_id: "",
  appointment_id: "",
  total_amount: "",
  invoice_date: todayLocal(),
  status: "Active",
});
export const defaultInvoice = emptyInvoice();
export const errorInvoice: Record<string, string[] | undefined> = {};

export function invoiceToPayload(i: Invoice, isEdit = false) {
  return {
    patient_id: i.patient_id,
    admission_id: i.admission_id === "" ? null : i.admission_id,
    appointment_id: i.appointment_id === "" ? null : i.appointment_id,
    total_amount: i.total_amount,
    invoice_date: i.invoice_date,
    ...(isEdit ? { status: i.status } : {}),
  };
}

export const invoiceToPayloadEdit = (i: Invoice) => invoiceToPayload(i, true);
