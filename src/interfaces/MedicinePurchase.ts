export interface MedicinePurchase {
  id: number;
  supplier_id: number | "";
  medicine_id: number | "";
  quantity: number | string;
  purchase_price: number | string;
  purchase_date: string;
  supplier?: { id: number; name: string; contact?: string | null };
  medicine?: { id: number; name: string };
}

export const defaultMedicinePurchase: MedicinePurchase = {
  id: 0,
  supplier_id: "",
  medicine_id: "",
  quantity: "",
  purchase_price: "",
  purchase_date: new Date().toLocaleDateString("en-CA"),
};
export const errorMedicinePurchase: Record<string, string[] | undefined> = {};
