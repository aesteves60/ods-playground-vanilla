import './dashboard.scss';
import template from './dashboard.html?raw';
import { store } from '@app/state/store';
import { Unsubscribe } from '@reduxjs/toolkit';
import { count as countProduct } from '@app/state/store/products';
import { count as countUsers } from '@app/state/store/users';
import { ACTION_STATUS } from '@app/constant/slice';
import { getQuerySelector } from '@app/helpers/render';
import { OdsSkeleton } from '@ovhcloud/ods-components';

class Dashboard {
  private spanProductsCount!: HTMLSpanElement
  private loadingProductsCount!: OdsSkeleton & HTMLElement

  private spanUsersCount!: HTMLSpanElement
  private loadingUsersCount!: OdsSkeleton & HTMLElement

  private previousCountUsersStatus = ACTION_STATUS.idle
  private previousCountProductStatus = ACTION_STATUS.idle
  private storeUnsubscribe?: Unsubscribe;

  init() {
    this.setHTMLElement()

    store.dispatch(countProduct())
    store.dispatch(countUsers())

    this.storeUnsubscribe = store.subscribe(() => {
      // Product change
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

      // Users change
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

      this.previousCountProductStatus = productsState.countStatus
      this.previousCountUsersStatus = usersState.countStatus
    })
  }

  destroy() {
    this.storeUnsubscribe?.()
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
