export const paymentMethods = [
  "Cash",
  "bKash",
  "Nagad",
  "Rocket",
  "Card",
  "Bank Transfer",
] as const;
export const paymentStatuses = [
  "Success",
  "Pending",
  "Failed",
  "Cancelled",
] as const;

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number | string;
  payment_method: string;
  payment_date: string;
  status: string;
  gateway?: string | null;
  transaction_id?: string | null;
  invoice?: { id: number; patient?: { id: number; name: string } | null };
  receiver?: { id: number; name: string } | null;
}

export const defaultPayment: Payment = {
  id: 0,
  invoice_id: 0,
  amount: "",
  payment_method: "Cash",
  payment_date: "",
  status: "Success",
};
export const errorPayment: Record<string, string[] | undefined> = {};
