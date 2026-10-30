import { ref } from "vue";
import { api } from "@/api";
import type { User } from "@/interfaces/User";
import type { Department } from "@/interfaces/Department";

// users and departments for the Doctor form dropdowns
export function useDoctorOptions() {
  const users = ref<User[]>([]);
  const departments = ref<Department[]>([]);

  api
    .get("users")
    .then((res) => {
      users.value = res.data.users;
    })
    .catch((err) => {
      console.log(err);
    });

  api
    .get("departments")
    .then((res) => {
      departments.value = res.data.departments;
    })
    .catch((err) => {
      console.log(err);
    });

  return { users, departments };
}
