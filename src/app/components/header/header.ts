import './header.scss'
import template from './header.html?raw';

import { OdsLink } from '@ovhcloud/ods-components';
import { RouteName } from '../../router/route';
import { getQuerySelector } from '../../helpers/render';
import { navigate } from '../../router/router';
import { signOut } from '../../state/store/session';
import { store } from '../../state/store';

class Header extends HTMLElement {
  linkSignOut!: OdsLink & HTMLElement;

  constructor () {
		super();

		this.innerHTML = template
	}

  connectedCallback() {
    this.linkSignOut = getQuerySelector<OdsLink & HTMLElement>('#header-sign-out')
    this.linkSignOut.addEventListener('click', async() => {
      await store.dispatch(signOut())
      navigate(RouteName.SIGN_IN);
    })
  }
}

export {
  Header,
}
