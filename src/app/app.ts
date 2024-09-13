import './app.scss';

import { getCurrentRouteKey, injectAppElement, navigate } from './router/router';
import { ACTION_STATUS } from './constant/slice';
import { DeleteModal } from './page/products/components/delete-modal/delete-modal';
import { FormProduct } from './page/products/components/form-product/form-product';
import { Header } from './components/header/header';
import { Link } from './components/link/link';
import { RouteName } from './router/route';
import { SideMenu } from './components/side-menu/side-menu';
import { defineCustomElements } from '@ovhcloud/ods-components/dist/loader';
import { getQuerySelector } from './helpers/render';
import { hasSessionToken } from './helpers/session';
import { store } from './state/store';

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

function navigateToCurrentRoute() {
  const routeKey = getCurrentRouteKey()
  if (routeKey) {
    navigate(routeKey)
    return true
  }
  return false
}

(() => {
  const app = getQuerySelector<HTMLElement>('#app')
  const appLayout = getQuerySelector<HTMLElement>('#app-layout');

  defineCustomElements();
  defineAppCustomElements();
  injectAppElement(app);

  window.onpopstate = () => {
    navigateToCurrentRoute()
  };

  store.subscribe(() => {
    const sessionState = store.getState().session;
    if (sessionState.signInStatus === ACTION_STATUS.succeeded) {
      appLayout.classList.add('app__layout--display')
      return
    }
    if (sessionState.signOutStatus === ACTION_STATUS.succeeded) {
      appLayout.classList.remove('app__layout--display')
    }
  })

  if (hasSessionToken()) {
    if (!navigateToCurrentRoute()) {
      navigate(RouteName.DASHBOARD)
    }
    appLayout.classList.add('app__layout--display')
  } else {
    navigate(RouteName.SIGN_IN);
  }
})();
