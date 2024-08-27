import './signIn.scss';
import template from './signIn.html?raw';

import { OdsButton, OdsFormField, OdsInput, OdsText } from '@ovhcloud/ods-components';
import { store } from '../../state/store';
import { navigate } from '../../router/router';
import { signIn } from '../../state/store/session';
import { ACTION_STATUS } from '../../constant/slice';
import { getQuerySelector } from '../../helpers/render';
import { RouteName } from '../../router/route';

class SignIn {
  button!: OdsButton;
  form!: HTMLFormElement;
  formFieldUsername!: OdsFormField;
  formFieldPassword!: OdsFormField;
  inputUsername!: (OdsInput & HTMLElement);
  inputPassword!: (OdsInput & HTMLElement);
  errorMessage!: (OdsText & HTMLElement);
  signInStatus?: ACTION_STATUS;

  init() {
    this.setHtmlElement()

    this.inputUsername?.addEventListener('odsChange', () => {
      this.onOdsInputChange(this.inputUsername, this.formFieldUsername, 'Fill the username, please')
    })

    this.inputPassword?.addEventListener('odsChange', () => {
      this.onOdsInputChange(this.inputPassword, this.formFieldPassword, 'Fill the password, please')
    })

    this.form?.addEventListener('submit', (event) => this.onSubmitForm(event))

    store.subscribe(async () => {
      let previousSignInStatus = this.signInStatus
      this.signInStatus = store.getState().session.signInStatus

      if (previousSignInStatus !== this.signInStatus) {
        await this.handlerSignInStatusChange()
      }
    })
  }

  private async handlerSignInStatusChange() {
    if(this.signInStatus === ACTION_STATUS.pending) {
      this.errorMessage.style.display = 'none'
      this.button.isLoading = true
    }

    if(this.signInStatus === ACTION_STATUS.succeeded) {
      this.button.isLoading = false;
      this.errorMessage.style.display = 'none'
      await navigate(RouteName.DASHBOARD);
    }

    if(this.signInStatus === ACTION_STATUS.failed) {
      this.errorMessage.style.display = 'block'
      this.button.isLoading = false
    }
  }

  private onOdsInputChange(input: OdsInput, formField: OdsFormField, message: string) {
    if (!input.value) {
      input.hasError = true
      formField.error = message
    } else {
      input.hasError = false
      formField.error = ''
    }
  }

  private async onSubmitForm(event: Event) {
    event.preventDefault()
    this.form?.reportValidity

    const passwordValue = this.inputPassword?.value
    const usernameValue = this.inputUsername?.value
    if (usernameValue && passwordValue) {
      store.dispatch(signIn({ username: usernameValue.toString(), password: passwordValue.toString() }))
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
}

export {
  SignIn
}
