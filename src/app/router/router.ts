import { Route, RouteName, routes } from "./route";

let app: HTMLElement;
const injectAppElement = (appElement: HTMLElement) => app = appElement;

const navigate = (routeName: RouteName, params?: Record<string, string>) => {
  getPreviousRoute()?.afterExit?.();
    const route = routes[routeName]
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

const getPreviousRoute = () => {
  return Object.values(routes).find((route) => route.path === window.location.pathname)
}

const renderPage = (route: Route) => {
    app.innerHTML = route.template
    return route.afterEnter?.()
}

export {
    injectAppElement,
    navigate,
};
