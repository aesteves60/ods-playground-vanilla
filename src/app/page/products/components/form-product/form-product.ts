import './form-product.scss';
import template from './form-product.html?raw';

import * as z from 'zod';
import { OdsButton, OdsFormField, OdsInput, OdsTextarea } from '@ovhcloud/ods-components';
import { Product } from '@app/models/product';
import { getQuerySelector } from '@app/helpers/render';

/* eslint-disable camelcase */
const validationSchema = z.object({
  // Category: z.string({ required_error: 'Category is required' }),
  description: z.string({ required_error: 'Description is required' }),
  price: z.number({
    invalid_type_error: 'Price must be a number',
    required_error: 'Price is required',
  }).positive('Price value should be positive'),
  // RestockDate: z.date(),
  // RestockTime: z.string(),
  title: z.string({ required_error: 'Title is required' }),
})
/* eslint-enable camelcase */

class FormProduct extends HTMLElement {
  private form!: HTMLFormElement;
  private formFieldTitle!: OdsFormField & HTMLElement;
  private formFieldPrice!: OdsFormField & HTMLElement;
  private formFieldDescription!: OdsFormField & HTMLElement;
  private inputTitle!: OdsInput & HTMLElement;
  private inputPrice!: OdsInput & HTMLElement;
  private textareaDescription!: OdsTextarea & HTMLElement;
  private buttonCancel!: OdsButton & HTMLElement;
  private buttonSubmit!: OdsButton & HTMLElement;

  constructor () {
		super();

		this.innerHTML = template
	}

  set product(value: Product) {
    this.setAttribute('product', JSON.stringify(value))
    this.inputTitle.value = this.product.title
    this.inputPrice.value = this.product.price
    this.textareaDescription.value = this.product.description
    this.buttonSubmit.label = 'Update'
  }

  get product(): Product {
    return JSON.parse(this.getAttribute('product') ?? '{}') as Product;
  }

  connectedCallback() {
    this.setHtmlElement()

    this.inputTitle.addEventListener('odsChange', () => {
      FormProduct.handleInputError(this.inputTitle, this.formFieldTitle, 'title')
    })

    this.inputPrice.addEventListener('odsChange', () => {
      FormProduct.handleInputError(this.inputPrice, this.formFieldPrice, 'price')
    })

    this.textareaDescription.addEventListener('odsChange', () => {
      FormProduct.handleInputError(this.textareaDescription, this.formFieldDescription, 'description')
    })

    this.buttonCancel.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel', {
        bubbles: true,
        cancelable: true,
        detail: {}
      }))
    })

    this.form.addEventListener('submit', () => {
      if (this.isValidForm()) {
        this.dispatchEvent(new CustomEvent('submitProduct', {
          bubbles: true,
          cancelable: true,
          detail: {
            description: this.textareaDescription.value,
            price: this.inputPrice.value,
            title: this.inputTitle.value,
          }
        }))
      }
    })
  }

  private isValidForm() {
    const titleError = FormProduct.handleInputError(this.inputTitle, this.formFieldTitle, 'title')
    const priceError = FormProduct.handleInputError(this.inputPrice, this.formFieldPrice, 'price')
    const descriptionError = FormProduct.handleInputError(this.textareaDescription, this.formFieldDescription, 'description')
    return !titleError && !priceError && !descriptionError
  }


  static handleInputError(input: OdsInput | OdsTextarea, formField: OdsFormField, key: string) {
    const value = key === 'price' ? Number(input.value) : input.value
    const result = validationSchema.safeParse({ [key]: value ?? undefined });
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === key)
      if (issue) {
        input.hasError = true
        formField.error = issue.message
        return issue.message;
      }
    }
    return ''
  }

  private setHtmlElement() {
    this.form = getQuerySelector('#form-product-form')
    this.formFieldTitle = getQuerySelector('#form-product-field-title')
    this.formFieldPrice = getQuerySelector('#form-product-field-price')
    this.formFieldDescription = getQuerySelector('#form-product-field-description')
    this.inputTitle = getQuerySelector('#form-product-input-title')
    this.inputPrice = getQuerySelector('#form-product-input-price')
    this.textareaDescription = getQuerySelector('#form-product-textarea-description')
    this.buttonCancel = getQuerySelector('#form-product-button-cancel')
    this.buttonSubmit = getQuerySelector('#form-product-button-submit')
  }
}

export {
  FormProduct,
}
