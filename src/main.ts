import "./style.css";
import "./compat.css";
import "./performance.css";
import "./premium-refined.css";
import "./pro-finish.css";
import "./effects-extra.css";
import { initSite } from "./initSite";
import { renderSite } from "./renderSite";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root #app not found");

renderSite(app);
initSite();
