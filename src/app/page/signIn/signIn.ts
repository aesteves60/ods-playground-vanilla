import './signIn.css';
import template from './signIn.html?raw';

class SignIn {
  button: HTMLButtonElement | null = null;

  init() {
    this.button = document.querySelector('#counter');
    this.button?.addEventListener('click', () => {
      console.log('counter click')
    });
  }

  static loadTemplate(): string {
    return template;
  }
}

export {
  SignIn
}