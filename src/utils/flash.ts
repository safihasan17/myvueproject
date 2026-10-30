import { ref } from "vue";

// One-time message that survives a redirect (e.g. "Doctor created successfully"
// shown on the Manage page after Add / Edit).
type Flash = { type: "success" | "danger"; text: string } | null;
const flash = ref<Flash>(null);

export const setFlash = (
  text: string,
  type: "success" | "danger" = "success",
) => {
  flash.value = { type, text };
};

export const takeFlash = (): Flash => {
  const f = flash.value;
  flash.value = null;
  return f;
};
