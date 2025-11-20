// Svelte 5 components can be 'isomorphic components'. Use a broad type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = any;
import Landing from "./routes/LandingPage.svelte";
import CaptchaPage from "./routes/CaptchaPage.svelte";
import MosquitoPage from "./routes/MosquitoPage.svelte";
import PrecisionPage from "./routes/PrecisionPage.svelte";
import TyperPage from "./routes/TyperPage.svelte";

export interface RouteDef {
  path: string;
  component: AnyComponent;
  title?: string;
}

export const routes: RouteDef[] = [
  { path: "/", component: Landing, title: "Home" },
  { path: "/captcha", component: CaptchaPage, title: "Completely Normal CAPTCHA" },
  { path: "/mosquito", component: MosquitoPage, title: "Machar Hunt" },
  { path: "/precision", component: PrecisionPage, title: "Perfect Click Precision" },
  { path: "/typer", component: TyperPage, title: "Chaos Typer" },
];

export function matchRoute(path: string): RouteDef {
  const exact = routes.find((r) => r.path === path);
  return exact || routes[0];
}

export type RouterState = { route: RouteDef };

export const routerState: RouterState = { route: matchRoute(getCurrentPath()) };

function getCurrentPath(): string {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

export function navigate(path: string) {
  if (path === routerState.route.path) return;
  window.location.hash = path === "/" ? "/" : path; // triggers hashchange
}

export function startRouter(onChange: () => void) {
  window.addEventListener("hashchange", () => {
    routerState.route = matchRoute(getCurrentPath());
    onChange();
  });
}
