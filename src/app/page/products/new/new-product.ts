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

    this.formProduct.addEventListener('cancel', () => navigate(RouteName.PRODUCTS))
    this.formProduct.addEventListener('submit', () => navigate(RouteName.PRODUCTS))
  }

  destroy() {
    this.formProduct.removeEventListener('cancel', () => navigate(RouteName.PRODUCTS))
    this.formProduct.removeEventListener('submit', () => navigate(RouteName.PRODUCTS))
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  NewProduct,
}
