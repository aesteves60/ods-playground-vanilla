import './breadcrumb.scss'
import template from './breadcrumb.html?raw';

import { OdsBreadcrumb } from '@ovhcloud/ods-components';
import { getQuerySelector } from '../../helpers/render';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

class Breadcrumb extends HTMLElement {
  breadcrumb!: OdsBreadcrumb & HTMLElement;

  constructor () {
		super();

		this.innerHTML = template
	}

  connectedCallback() {
    this.breadcrumb = getQuerySelector<OdsBreadcrumb & HTMLElement>('#ods-breadcrumb')
    const pathParts = location.pathname.split('/').filter(Boolean)

    this.breadcrumb.innerHTML = pathParts.map((pathPart) =>
      `<ods-breadcrumb-item href="${pathPart}" label="${capitalize(pathPart)}"></ods-breadcrumb-item>`
    ).join('')
  }
}

export {
  Breadcrumb,
}
