export interface Supplier {
  id: number;
  name: string;
  contact: string;
  address: string;
  purchases_count?: number;
}

export const defaultSupplier: Supplier = {
  id: 0,
  name: "",
  contact: "",
  address: "",
};
export const errorSupplier: Record<string, string[] | undefined> = {};
