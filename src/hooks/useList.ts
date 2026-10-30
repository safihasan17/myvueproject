import { ref } from "vue";
import { api } from "@/api";

// Fetches a list for a dropdown. `key` is the property of the response that holds the array
// (empty key = the response itself is the array, like GET roles).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export function useList(url: string, key = "", params: Row = {}) {
  const items = ref<Row[]>([]);
  api
    .get(url, { params })
    .then((res) => {
      items.value = (key ? res.data[key] : res.data) ?? [];
    })
    .catch((err) => {
      console.log(err);
    });
  return items;
}
