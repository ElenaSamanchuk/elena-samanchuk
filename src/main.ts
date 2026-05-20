import "./styles/tailwind.css";
import "./styles/type.css";
import "./styles/widgets.css";
import "./styles/ux.css";
import { initSite } from "./initSite";
import { renderSite } from "./renderSite";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root #app not found");

renderSite(app);
initSite();
