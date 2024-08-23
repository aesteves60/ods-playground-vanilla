import { SignIn } from "./page/signIn/signIn";
import { changeAppInnerHTML, injectAppElement, navigate, routes } from "./router/router";

(async () => {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('App element missing');
    }
    
    injectAppElement(app);
    await changeAppInnerHTML(routes[window.location.pathname]);

    const nav = document.getElementById('nav');
    if (nav) {
        nav.innerHTML = `
            <a href="/" id="nav-sign-in" onclick="return false;">signIn</a>
            <a href="/contact" id="nav-contact" onclick="return false;">Contact</a>
        `;
        document.querySelector('#nav-sign-in')?.addEventListener('click', () => {
            navigate('/');
            const signIn = new SignIn();
            signIn.init();
        });
        document.querySelector('#nav-contact')?.addEventListener('click', () => navigate('/contact'));
    }
})();