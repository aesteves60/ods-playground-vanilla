/* eslint-disable class-methods-use-this */
import './users.scss';
import template from './users.html?raw';

class Users {
  init() {
    // Must be defined
  }

  destroy() {
    // Must be defined
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  Users,
}
