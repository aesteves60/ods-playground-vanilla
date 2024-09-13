import './signIn.scss';
import template from './signIn.html?raw';

import { OdsButton, OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components';
import { ACTION_STATUS } from '@app/constant/slice';
import { RouteName } from '@app/router/route';
import { Unsubscribe } from '@reduxjs/toolkit';
import { getQuerySelector } from '@app/helpers/render';
import { navigate } from '@app/router/router';
import { signIn } from '@app/state/store/session';
import { store } from '@app/state/store';

class SignIn {
  private button!: OdsButton;
  private form!: HTMLFormElement;
  private formFieldUsername!: OdsFormField;
  private formFieldPassword!: OdsFormField;
  private inputUsername!: (OdsInput & HTMLElement);
  private inputPassword!: (OdsInput & HTMLElement);
  private errorMessage!: (OdsText & HTMLElement);
  private signInStatus?: ACTION_STATUS;

  private storeUnsubscribe?: Unsubscribe;

  init() {
    this.setHtmlElement()

    this.inputUsername.addEventListener('odsChange', () => this.handlerOdsChangeUsername())

    this.inputPassword.addEventListener('odsChange', () => this.handlerOdsChangePassword())

    this.form.addEventListener('submit', (event) => this.onSubmitForm(event))

    this.storeUnsubscribe = store.subscribe(() => {
      const previousSignInStatus = this.signInStatus
      this.signInStatus = store.getState().session.signInStatus

      if (previousSignInStatus !== this.signInStatus) {
        this.handlerSignInStatusChange()
      }
    })
  }

  destroy() {
    this.storeUnsubscribe?.()
    this.inputUsername.removeEventListener('odsChange', () => this.handlerOdsChangeUsername())
    this.inputPassword.removeEventListener('odsChange', () => this.handlerOdsChangePassword())
    this.form.removeEventListener('submit', (event) => this.onSubmitForm(event))
  }

  private handlerOdsChangeUsername() {
    SignIn.onOdsInputChange(this.inputUsername, this.formFieldUsername, 'Fill the username, please')
  }

  private handlerOdsChangePassword() {
    SignIn.onOdsInputChange(this.inputPassword, this.formFieldPassword, 'Fill the password, please')
  }

  private handlerSignInStatusChange() {
    if (this.signInStatus === ACTION_STATUS.pending) {
      this.errorMessage.style.display = 'none'
      this.button.isLoading = true
    }

    if (this.signInStatus === ACTION_STATUS.succeeded) {
      this.button.isLoading = false;
      this.errorMessage.style.display = 'none'
      navigate(RouteName.DASHBOARD);
    }

    if (this.signInStatus === ACTION_STATUS.failed) {
      this.errorMessage.style.display = 'block'
      this.button.isLoading = false
    }
  }

  private onSubmitForm(event: Event) {
    event.preventDefault()

    const passwordValue = this.inputPassword.value,
     usernameValue = this.inputUsername.value
    if (usernameValue && passwordValue) {
      void  store.dispatch(signIn({
        password: passwordValue.toString(),
        username: usernameValue.toString(),
      }))
    }
  }

  private setHtmlElement() {
    this.button = getQuerySelector<OdsButton & HTMLElement>('#sign-in-submit')
    this.errorMessage = getQuerySelector<OdsText & HTMLElement>('#sign-in-error-message')
    this.form = getQuerySelector('#sign-in-form')
    this.inputUsername = getQuerySelector<OdsInput & HTMLElement>('#sign-in-username')
    this.inputPassword = getQuerySelector<OdsInput & HTMLElement>('#sign-in-password')
    this.formFieldUsername = getQuerySelector<OdsFormField & HTMLElement>('#sign-in-form-field-username')
    this.formFieldPassword = getQuerySelector<OdsFormField & HTMLElement>('#sign-in-form-field-password')
  }

  static loadTemplate(): string {
    return template
  }

  private static onOdsInputChange(input: OdsInput, formField: OdsFormField, message: string) {
    if (input.value) {
      input.hasError = false
      formField.error = ''
    } else {
      input.hasError = true
      formField.error = message
    }
  }
}

export {
  SignIn
}
