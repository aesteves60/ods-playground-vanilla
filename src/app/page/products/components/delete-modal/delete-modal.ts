import template from './delete-modal.html?raw';

import { getQuerySelector } from '@app/helpers/render';
import { OdsButton, OdsModal } from '@ovhcloud/ods-components';
class DeleteModal extends HTMLElement {
  private buttonCancel!: OdsButton & HTMLElement;
  private buttonDelete!: OdsButton & HTMLElement;
  private modal!: OdsModal & HTMLElement;
  private p!: HTMLParagraphElement;

  constructor () {
		super();

		this.innerHTML = template
	}

  set isOpen(value: boolean) {
    if (value) {
      this.setAttribute('is-open', '')
      this.modal.isOpen = true
    } else {
      this.removeAttribute('is-open')
      this.modal.isOpen = false
    }
  }

  get isOpen() {
    return this.hasAttribute('is-open');
  }

  set productTitle(value: string) {
    this.setAttribute('product-title', value)
    this.p.innerText = this.p.innerText.replace('{ productTitle }', value ?? '')
  }

  get productTitle(): string | null {
    return this.getAttribute('product-title');
  }

  connectedCallback() {
    this.setElement()

    this.modal.addEventListener('odsClose', () => {
      this.close()
    })
    this.buttonCancel.addEventListener('click', () => {
      this.close()
    })

    this.buttonDelete.addEventListener('click', () => {
      this.emitDelete()
      this.close()
    })
  }

  private emitDelete() {
    const event = new CustomEvent('delete', {
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
  }

  private close() {
    this.isOpen = false
    this.setPDataBinding()
  }

  private setPDataBinding() {
    this.p.innerText = this.p.innerText.replace(this.productTitle ?? '', '{ productTitle }')
  }

  private setElement() {
    this.buttonCancel = getQuerySelector('#delete-modal-cancel', this)
    this.buttonDelete = getQuerySelector('#delete-modal-delete', this)
    this.modal = getQuerySelector('#delete-modal', this);
    this.p = getQuerySelector('p', this);
  }
}

export {
  DeleteModal,
}
