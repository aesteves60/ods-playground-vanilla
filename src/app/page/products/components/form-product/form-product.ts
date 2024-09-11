import './form-product.scss';
import template from './form-product.html?raw';
import { OdsButton, OdsFormField, OdsInput, OdsTextarea } from '@ovhcloud/ods-components';
import { getQuerySelector } from '@app/helpers/render';
import * as z from 'zod';
import { Product } from '@app/models/product';

const validationSchema = z.object({
  // category: z.string({ required_error: 'Category is required' }),
  description: z.string({ required_error: 'Description is required' }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }).positive('Price value should be positive'),
  // restockDate: z.date(),
  // restockTime: z.string(),
  title: z.string({ required_error: 'Title is required' }),
})


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
    return JSON.parse(this.getAttribute('product') ?? '{}');
  }

  connectedCallback() {
    this.setHtmlElement()

    this.inputTitle?.addEventListener('odsChange', async() => {
      await this.handleInputError(this.inputTitle, this.formFieldTitle, 'title')
    })

    this.inputPrice?.addEventListener('odsChange', async() => {
      await this.handleInputError(this.inputPrice, this.formFieldPrice, 'price')
    })

    this.textareaDescription?.addEventListener('odsChange', async() => {
      await this.handleInputError(this.textareaDescription, this.formFieldDescription, 'description')
    })

    this.buttonCancel.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel', {
        bubbles: true,
        cancelable: true,
        detail: {}
      }))
    })

    this.form.addEventListener('submit', async() => {
      if (await this.isValidForm()) {
        this.dispatchEvent(new CustomEvent('submitProduct', {
          bubbles: true,
          cancelable: true,
          detail: {
            title: this.inputTitle.value,
            price: this.inputPrice.value,
            description: this.textareaDescription.value,
          }
        }))
      }
    })
  }

  private async isValidForm() {
    const titleError = await this.handleInputError(this.inputTitle, this.formFieldTitle, 'title')
    const priceError = await this.handleInputError(this.inputPrice, this.formFieldPrice, 'price')
    const descriptionError = await this.handleInputError(this.textareaDescription, this.formFieldDescription, 'description')
    return !titleError && !priceError && !descriptionError
  }

  private async handleInputError(input: OdsInput | OdsTextarea, formField: OdsFormField, key: string) {
    const value = key === 'price' ? Number(input.value) : input.value;
    const result = await validationSchema.safeParse({ [key]: value ?? undefined });
    if (!result.success) {
      for (const issue of result.error.issues) {
        if (issue.path[0] === key) {
          input.hasError = true
          formField.error = issue.message
          return issue.message;
        } else {
          input.hasError = false
          formField.error = ''
        }
      }
    }
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
