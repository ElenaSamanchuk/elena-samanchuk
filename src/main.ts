import "./styles/index.css";
import { initSite } from "./initSite";
import { renderSite } from "./renderSite";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root #app not found");

renderSite(app);
void initSite();
