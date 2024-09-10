import { Route, RouteName, routes } from "./route";

let app: HTMLElement;
const injectAppElement = (appElement: HTMLElement) => app = appElement;

const navigate = (routeName: RouteName) => {
    getPreviousRoute()?.afterExit?.();
    const route = routes[routeName]
    window.history.pushState(
        {},
        route.path,
        window.location.origin + route.path,
    );

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
