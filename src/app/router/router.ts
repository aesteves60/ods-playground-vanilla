import { contact } from "../contact";
import { SignIn } from "../page/signIn/signIn";

type Route = string;

const routes: Record<Route, (() => Promise<string>) | string> = {
    '/' : SignIn.loadTemplate(),
    '/contact' : contact,
};

let app: HTMLElement;
const injectAppElement = (appElement: HTMLElement) => app = appElement;

const navigate = async (route: Route) => {
    window.history.pushState(
        {},
        route,
        window.location.origin + route,
    );
    await changeAppInnerHTML(routes[route]);
};

window.onpopstate = async () => {
    await changeAppInnerHTML(routes[window.location.pathname]);
};

const changeAppInnerHTML = async (template: (() => Promise<string>) | string): Promise<void> => {
    if (typeof template === 'string') {
        app.innerHTML = template;
    } else {
        app.innerHTML = await template?.();
    }
};

export {
    changeAppInnerHTML,
    injectAppElement,
    navigate,
    routes,
};