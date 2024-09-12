import './link.scss'
import template from './link.html?raw';

import { OdsLink } from '@ovhcloud/ods-components';
import { RouteName } from '../../router/route';
import { getQuerySelector } from '../../helpers/render';
import { navigate } from '../../router/router';

class Link extends HTMLElement {
  private link!: OdsLink & HTMLElement;
  private additionalId = Math.floor(Math.random() * 1000).toString();

  constructor () {
		super();

		this.innerHTML = template
	}

  set route(value: RouteName){
    this.setAttribute('route', value)
  }

  get route() {
    return this.getAttribute('route') as RouteName
  }

  set label(value: string){
    this.setAttribute('label', value)
  }

  get label() {
    return this.getAttribute('label') ?? ''
  }

  connectedCallback() {
    this.link = getQuerySelector('#app-link')
    this.link.id += this.additionalId
    this.link.label = this.label

    this.link.addEventListener('click', () => navigate(this.route))
  }
}

export {
  Link,
}
