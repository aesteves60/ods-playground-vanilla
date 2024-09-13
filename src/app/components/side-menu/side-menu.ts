import './side-menu.scss'
import template from './side-menu.html?raw';

class SideMenu extends HTMLElement {

  constructor () {
		super();

		this.innerHTML = template
	}
}

export {
  SideMenu,
}
