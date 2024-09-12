import './dashboard.scss';
import template from './dashboard.html?raw';

import { ACTION_STATUS } from '@app/constant/slice';
import { OdsSkeleton } from '@ovhcloud/ods-components';
import { Unsubscribe } from '@reduxjs/toolkit';
import { count as countProduct } from '@app/state/store/products';
import { count as countUsers } from '@app/state/store/users';
import { getQuerySelector } from '@app/helpers/render';
import { store } from '@app/state/store';

class Dashboard {
  private spanProductsCount!: HTMLSpanElement
  private loadingProductsCount!: OdsSkeleton & HTMLElement

  private spanUsersCount!: HTMLSpanElement
  private loadingUsersCount!: OdsSkeleton & HTMLElement

  private previousCountUsersStatus = ACTION_STATUS.idle
  private previousCountProductStatus = ACTION_STATUS.idle
  private storeUnsubscribe?: Unsubscribe;

  async init() {
    this.setHTMLElement()

    await store.dispatch(countProduct())
    await store.dispatch(countUsers())

    this.storeUnsubscribe = store.subscribe(() => {
      this.handlerProductsChange()
      this.handlerUsersChange()
    })
  }

  destroy() {
    this.storeUnsubscribe?.()
    this.previousCountUsersStatus = ACTION_STATUS.idle
    this.previousCountProductStatus = ACTION_STATUS.idle
  }

  private handlerProductsChange() {
    const productsState = store.getState().products
    const hasCountProductsStatusChange = this.previousCountProductStatus !== productsState.countStatus
    if (hasCountProductsStatusChange && productsState.countStatus === ACTION_STATUS.succeeded) {
      this.spanProductsCount.innerText = `You have ${productsState.count} products registered`
      this.loadingProductsCount.style.display = 'none'
      this.spanProductsCount.style.display = 'block'
    }
    if (hasCountProductsStatusChange && productsState.countStatus === ACTION_STATUS.pending) {
      this.loadingProductsCount.style.display = 'block'
      this.spanProductsCount.style.display = 'none'
    }
    this.previousCountProductStatus = productsState.countStatus
  }

  private handlerUsersChange() {
    const usersState = store.getState().users
    const hasCountUsersStatusChange = this.previousCountUsersStatus !== usersState.countStatus
    if (hasCountUsersStatusChange && usersState.countStatus === ACTION_STATUS.succeeded) {
      this.spanUsersCount.innerText = `You have ${usersState.count} users registered`
      this.loadingUsersCount.style.display = 'none'
      this.spanUsersCount.style.display = 'block'
    }
    if (hasCountUsersStatusChange && usersState.countStatus === ACTION_STATUS.pending) {
      this.loadingUsersCount.style.display = 'block'
      this.spanUsersCount.style.display = 'none'
    }
    this.previousCountUsersStatus = usersState.countStatus
  }

  static loadTemplate(): string {
    return template
  }

  private setHTMLElement() {
    this.spanProductsCount = getQuerySelector('#dashboard-products-count')
    this.loadingProductsCount = getQuerySelector('#dashboard-products-count-loading')

    this.spanUsersCount = getQuerySelector('#dashboard-users-count')
    this.loadingUsersCount = getQuerySelector('#dashboard-users-count-loading')

  }
}

export {
  Dashboard,
}
