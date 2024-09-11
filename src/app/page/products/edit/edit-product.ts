import './edit-product.scss';
import template from './edit-product.html?raw';
import { store } from '@app/state/store';
import { getById } from '@app/state/store/products';
import { ACTION_STATUS } from '@app/constant/slice';
import { FormProduct } from '../components/form-product/form-product';
import { getQuerySelector } from '@app/helpers/render';
import { navigate } from '@app/router/router';
import { RouteName } from '@app/router/route';
import { Unsubscribe } from '@reduxjs/toolkit';

class EditProduct {
  private previousGetByIdStatus = ACTION_STATUS.idle
  private formProduct!: FormProduct
  private storeUnsubscribe?: Unsubscribe

  async init() {
    this.setHTMLElement()

    const id = Number(window.location.pathname.split('/').pop())
    store.dispatch(getById(id));
    this.storeUnsubscribe = store.subscribe(() => {
      const productsState = store.getState().products
      const hasGetByIdStatusChange = this.previousGetByIdStatus !== productsState.listStatus
      if (hasGetByIdStatusChange && productsState.getByIdStatus === ACTION_STATUS.succeeded && productsState.product) {
        this.formProduct.product = productsState.product
      }
    })

    this.formProduct.addEventListener('cancel', () => navigate(RouteName.PRODUCTS))
    this.formProduct.addEventListener('submitProduct', () => navigate(RouteName.PRODUCTS))
  }

  destroy() {
    this.storeUnsubscribe?.()
    this.formProduct.removeEventListener('cancel', () => navigate(RouteName.PRODUCTS))
    this.formProduct.removeEventListener('submitProduct', () => navigate(RouteName.PRODUCTS))
  }

  private setHTMLElement() {
    this.formProduct = getQuerySelector('#edit-product-form')
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  EditProduct,
}
