import './new-product.scss';
import template from './new-product.html?raw';
import { FormProduct } from '../components/form-product/form-product';
import { getQuerySelector } from '@app/helpers/render';
import { navigate } from '@app/router/router';
import { RouteName } from '@app/router/route';

class NewProduct {
  private formProduct!: FormProduct;

  async init() {
    this.formProduct = getQuerySelector('#new-product-form')

    this.formProduct.addEventListener('cancel', () => this.navigateToProduct())
    this.formProduct.addEventListener('submitProduct', () => this.navigateToProduct())
  }

  private navigateToProduct() {
    navigate(RouteName.PRODUCTS)
  }

  destroy() {
    this.formProduct.removeEventListener('cancel', () => this.navigateToProduct())
    this.formProduct.removeEventListener('submitProduct', () => this.navigateToProduct())
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  NewProduct,
}
