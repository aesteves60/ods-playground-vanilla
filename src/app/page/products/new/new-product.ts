import './new-product.scss';
import template from './new-product.html?raw';

import { FormProduct } from '../components/form-product/form-product';
import { RouteName } from '@app/router/route';
import { getQuerySelector } from '@app/helpers/render';
import { navigate } from '@app/router/router';

class NewProduct {
  private formProduct!: FormProduct;

  init() {
    this.formProduct = getQuerySelector('#new-product-form')

    this.formProduct.addEventListener('cancel', () => NewProduct.navigateToProduct())
    this.formProduct.addEventListener('submitProduct', () => NewProduct.navigateToProduct())
  }

  destroy() {
    this.formProduct.removeEventListener('cancel', () => NewProduct.navigateToProduct())
    this.formProduct.removeEventListener('submitProduct', () => NewProduct.navigateToProduct())
  }

  static loadTemplate(): string {
    return template
  }

  private static navigateToProduct() {
    navigate(RouteName.PRODUCTS)
  }
}

export {
  NewProduct,
}
