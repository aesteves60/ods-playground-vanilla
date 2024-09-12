import './app.scss';
import { Header } from './components/header/header';
import { Link } from './components/link/link';
import { SideMenu } from './components/side-menu/side-menu';
import { hasSessionToken } from './helpers/session';
import { RouteName } from './router/route';
import { getCurrentRouteKey, injectAppElement, navigate } from './router/router';
import { defineCustomElements } from '@ovhcloud/ods-components/dist/loader';
import { store } from './state/store';
import { getQuerySelector } from './helpers/render';
import { ACTION_STATUS } from './constant/slice';
import { FormProduct } from './page/products/components/form-product/form-product';
import { DeleteModal } from './page/products/components/delete-modal/delete-modal';

(async () => {
  const app = getQuerySelector<HTMLElement>('#app');
  const appLayout = getQuerySelector<HTMLElement>('#app-layout');

  defineCustomElements();
  defineAppCustomElements();
  injectAppElement(app);

  window.onpopstate = () => {
    const routeKey = getCurrentRouteKey()
    routeKey && navigate(routeKey);
  };

  store.subscribe(() => {
    const sessionState = store.getState().session;
    if (sessionState.signInStatus === ACTION_STATUS.succeeded) {
      return appLayout.classList.add('app__layout--display')
    }
    if (sessionState.signOutStatus === ACTION_STATUS.succeeded) {
      return appLayout.classList.remove('app__layout--display')
    }
  })

  if (hasSessionToken()) {
    const routeKey = getCurrentRouteKey()
    if (routeKey) {
      navigate(routeKey);
    } else {
      navigate(RouteName.DASHBOARD)
    }
    appLayout.classList.add('app__layout--display')
  } else {
    navigate(RouteName.SIGN_IN);
  }
})();

function defineAppCustomElements() {
  // Define the new web component
  if ('customElements' in window) {
    customElements.define('app-header', Header);
    customElements.define('app-side-menu', SideMenu);
    customElements.define('app-link', Link);
    customElements.define('app-form-product', FormProduct);
    customElements.define('app-product-delete-modal', DeleteModal);
  }
}
