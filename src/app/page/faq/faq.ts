import './faq.scss';
import template from './faq.html?raw';

class Faq {
  // eslint-disable-next-line class-methods-use-this
  init() {
    // Should be implement
  }

  // eslint-disable-next-line class-methods-use-this
  destroy() {
    // Should be implement
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  Faq,
}
