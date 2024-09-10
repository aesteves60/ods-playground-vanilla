import './header.scss'
import template from './header.html?raw';

import { OdsLink } from '@ovhcloud/ods-components';
import { getQuerySelector } from '../../helpers/render';
import { store } from '../../state/store';
import { signOut } from '../../state/store/session';
import { navigate } from '../../router/router';
import { RouteName } from '../../router/route';

class Header extends HTMLElement {
  linkSignOut!: OdsLink & HTMLElement;

  constructor () {
		super();

		this.innerHTML = template
	}

  connectedCallback() {
    this.linkSignOut = getQuerySelector<OdsLink & HTMLElement>('#header-sign-out')
    this.linkSignOut.addEventListener('click', () => {
      store.dispatch(signOut())
      navigate(RouteName.SIGN_IN);
    })
  }
}

export {
  Header,
}
