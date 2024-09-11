import './app.scss';
import { hasSessionToken } from './helpers/session';
import { RouteName } from './router/route';
import { injectAppElement, navigate } from './router/router';
import { defineCustomElements } from '@ovhcloud/ods-components/dist/loader';

(async () => {
    const app = document.getElementById('app');

    if (!app) {
        throw new Error('App element missing');
    }

    defineCustomElements();
    injectAppElement(app);

    if (hasSessionToken()) {
        navigate(RouteName.DASHBOARD);
    } else {
        navigate(RouteName.SIGN_IN);
    }
})();
