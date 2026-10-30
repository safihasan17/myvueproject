export type Role = {
  id: number;
  name: string;
  users_count?: number;
};

export const defaultRole: Role = {
  id: 0,
  name: "",
};
