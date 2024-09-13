import { Route, RouteName, routes } from "./route";
import { hasSessionToken } from "@app/helpers/session";
import { nextTick } from "@app/helpers/render";

// eslint-disable-next-line init-declarations
let app: HTMLElement;

function injectAppElement(appElement: HTMLElement) {
  app = appElement
}


function getCurrentRoute() {
  return Object.values(routes).find((route) => route.path === window.location.pathname)
}

function getCurrentRouteKey() {
  return Object.keys(routes).find((routeKey) => routes[routeKey as RouteName].path === window.location.pathname) as RouteName | undefined
}

function renderPage(route: Route) {
  app.innerHTML = route.template
  nextTick(() => route.afterEnter?.())
}

function navigate(routeName: RouteName, params?: Record<string, string>) {
  const route = routes[routeName]
  if (hasSessionToken() && route.path !== window.location.pathname) {
    getCurrentRoute()?.afterExit?.();
  }

  const pathWithParams = params ? route.path.split('/').map((segment) => params[segment] ?? segment).join('/') : route.path
  const url = new URL(window.location.origin + pathWithParams)
  window.history.pushState({}, "", url);

  if (routeName === RouteName.SIGN_IN) {
    return renderPage(route);
  }

  if (route.guard?.()) {
    return renderPage(route);
  }
  return navigate(RouteName.SIGN_IN);
}

export {
  getCurrentRouteKey,
  injectAppElement,
  navigate,
};
