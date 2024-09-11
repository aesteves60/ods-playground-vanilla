import { nextTick } from "@app/helpers/render";
import { Route, RouteName, routes } from "./route";

let app: HTMLElement;
const injectAppElement = (appElement: HTMLElement) => app = appElement;

const navigate = (routeName: RouteName, params?: Record<string, string>) => {
  const route = routes[routeName]
  if (route.path !== window.location.pathname) {
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
  } else {
    return navigate(RouteName.SIGN_IN);
  }
};


const getCurrentRoute = () => {
  return Object.values(routes).find((route) => route.path === window.location.pathname)
}

const getCurrentRouteKey = () => {
  return Object.keys(routes).find((routeKey) => routes[routeKey as RouteName].path === window.location.pathname) as RouteName | undefined
}

const renderPage = (route: Route) => {
  app.innerHTML = route.template
  nextTick(() => route.afterEnter?.())
}

export {
  getCurrentRouteKey,
  injectAppElement,
  navigate,
};
