import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./assets/css/index.css";
import App from "./App.vue";
import { router } from "./route.ts";

createApp(App).use(router).mount("#app");
