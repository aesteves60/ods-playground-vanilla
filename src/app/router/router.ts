import { Route, RouteName, routes } from "./route";

let app: HTMLElement;
const injectAppElement = (appElement: HTMLElement) => app = appElement;

const navigate = (routeName: RouteName) => {
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

const renderPage = (route: Route) => {
    app.innerHTML = route.template
    return route.afterEnter?.()
}

export {
    injectAppElement,
    navigate,
};