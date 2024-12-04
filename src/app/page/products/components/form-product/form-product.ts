import './form-product.scss';
import template from './form-product.html?raw';

import { OdsButton, OdsCheckbox, OdsFormField, OdsInput, OdsQuantity, OdsRange, OdsSelect, OdsTextarea, OdsTimepicker } from '@ovhcloud/ods-components';
import { ACTION_STATUS } from '@app/constant/slice';
import { Category } from '@app/models/category';
import { Product } from '@app/models/product';
import { Unsubscribe } from '@reduxjs/toolkit';
import { getProductCategories } from '@app/state/store/products';
import { getQuerySelector } from '@app/helpers/render';
import { store } from '@app/state/store';

class FormProduct extends HTMLElement {
  private form!: HTMLFormElement;
  private formFieldTitle!: OdsFormField & HTMLElement;
  private formFieldPrice!: OdsFormField & HTMLElement;
  private formFieldDescription!: OdsFormField & HTMLElement;
  private formFieldCategory!: OdsFormField & HTMLElement;
  private formFieldStock!: OdsFormField & HTMLElement;
  private formFieldMinOrder!: OdsFormField & HTMLElement;
  private formFieldReturnPolicy!: OdsFormField & HTMLElement;
  private formFieldRestockTime!: OdsFormField & HTMLElement;

  private inputTitle!: OdsInput & HTMLElement;
  private inputPrice!: OdsInput & HTMLElement;
  private textareaDescription!: OdsTextarea & HTMLElement;
  private selectCategory!: OdsSelect & HTMLElement;
  private quantityStock!: OdsQuantity & HTMLElement;
  private rangeMinOrder!: OdsRange & HTMLElement;
  private checkboxReturnPolicy!: OdsCheckbox & HTMLElement;
  private timepickerRestockTime!: OdsTimepicker & HTMLElement;

  private buttonCancel!: OdsButton & HTMLElement;
  private buttonSubmit!: OdsButton & HTMLElement;

  private previousProductCategoriesStatus = ACTION_STATUS.idle
  private storeUnsubscribe?: Unsubscribe

  constructor() {
    super();

    this.innerHTML = template
  }

  set product(value: Product) {
    this.setAttribute('product', JSON.stringify(value))
    this.inputTitle.value = this.product.title
    this.inputPrice.value = this.product.price
    this.textareaDescription.value = this.product.description
    this.selectCategory.value = this.product.category
    this.quantityStock.value = this.product.stock
    this.rangeMinOrder.value = this.product.minimumOrderQuantity
    this.checkboxReturnPolicy.isChecked = this.product.hasReturnPolicy
    this.timepickerRestockTime.value = this.product.restockTime

    this.buttonSubmit.label = 'Update'
  }

  get product(): Product {
    return JSON.parse(this.getAttribute('product') ?? '{}') as Product;
  }

  async connectedCallback() {
    this.setHtmlElement()
    this.handlerOdsInvalid()
    await this.buildCategoryOption([{ name: 'test', slug: '', url: '' } as Category]);

    void store.dispatch(getProductCategories());
    this.storeUnsubscribe = store.subscribe(async() => {
      const productsState = store.getState().products
      const hasProductCategoriesStatusChange = this.previousProductCategoriesStatus !== productsState.categoriesStatus
      if (hasProductCategoriesStatusChange && productsState.categoriesStatus === ACTION_STATUS.succeeded) {
        console.log('categories change', )
        await this.buildCategoryOption(productsState.categories)
      }
      this.previousProductCategoriesStatus = productsState.categoriesStatus
    })

    this.buttonCancel.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, cancelable: true, detail: {} }))
    })

    this.form.addEventListener('submit', () => {
      this.dispatchEvent(new CustomEvent('submitProduct', { bubbles: true, cancelable: true,
        detail: {
          description: this.textareaDescription.value,
          price: this.inputPrice.value,
          title: this.inputTitle.value,
        }
      }))
    })
  }

  destroy() {
    this.storeUnsubscribe?.()
    this.previousProductCategoriesStatus = ACTION_STATUS.idle;
  }

  private handlerOdsInvalid() {
    this.inputTitle.addEventListener('odsInvalid', async() => {
      this.formFieldTitle.error = await this.inputTitle.getValidationMessage();
    })

    this.inputPrice.addEventListener('odsInvalid', async() => {
      this.formFieldPrice.error = await this.inputPrice.getValidationMessage();
    })

    this.textareaDescription.addEventListener('odsInvalid', async() => {
      this.formFieldDescription.error = await this.textareaDescription.getValidationMessage();
    })

    this.quantityStock.addEventListener('odsInvalid', async() => {
      this.formFieldStock.error = await this.quantityStock.getValidationMessage();
    })

    this.selectCategory.addEventListener('odsInvalid', async() => {
      this.formFieldCategory.error = await this.selectCategory.getValidationMessage();
    })

    this.rangeMinOrder.addEventListener('odsInvalid', async() => {
      this.formFieldMinOrder.error = await this.rangeMinOrder.getValidationMessage();
    })

    this.checkboxReturnPolicy.addEventListener('odsInvalid', async() => {
      this.formFieldReturnPolicy.error = await this.checkboxReturnPolicy.getValidationMessage() ?? '';
    })

    this.timepickerRestockTime.addEventListener('odsInvalid', async() => {
      this.formFieldRestockTime.error = await this.timepickerRestockTime.getValidationMessage();
    })
  }

  private async buildCategoryOption(categories: Category[]) {
    console.log('buildCategoryOption', categories)
    this.selectCategory.innerHTML = categories.map((c) => `<option value="${c.slug}">${c.name}</option>`).join('')
  }

  // eslint-disable-next-line max-statements
  private setHtmlElement() {
    this.form = getQuerySelector('#form-product-form')
    this.formFieldTitle = getQuerySelector('#form-product-field-title')
    this.formFieldPrice = getQuerySelector('#form-product-field-price')
    this.formFieldDescription = getQuerySelector('#form-product-field-description')
    this.formFieldCategory = getQuerySelector('#form-product-field-category')
    this.formFieldStock = getQuerySelector('#form-product-field-stock')
    this.formFieldMinOrder = getQuerySelector('#form-product-field-min-order')
    this.formFieldReturnPolicy = getQuerySelector('#form-product-field-return-policy')
    this.formFieldRestockTime = getQuerySelector('#form-product-field-restock-time')

    this.inputTitle = getQuerySelector('#form-product-input-title')
    this.inputPrice = getQuerySelector('#form-product-input-price')
    this.textareaDescription = getQuerySelector('#form-product-textarea-description')
    this.selectCategory = getQuerySelector('#form-product-select-category')
    this.quantityStock = getQuerySelector('#form-product-quantity-stock')
    this.rangeMinOrder = getQuerySelector('#form-product-range-min-order')
    this.checkboxReturnPolicy = getQuerySelector('#form-product-checkbox-return-policy')
    this.timepickerRestockTime = getQuerySelector('#form-product-timepicker-restock-time')

    this.buttonCancel = getQuerySelector('#form-product-button-cancel')
    this.buttonSubmit = getQuerySelector('#form-product-button-submit')
  }
}

export {
  FormProduct,
}
