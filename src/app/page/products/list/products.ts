import './products.scss';
import template from './products.html?raw';

import { OdsPagination, OdsPaginationCurrentChangeEvent, OdsTable } from '@ovhcloud/ods-components';
import { ProductReducerState, deleteProduct, list } from '@app/state/store/products';
import { getQuerySelector, nextTick } from '@app/helpers/render';
import { ACTION_STATUS } from '@app/constant/slice';
import { DeleteModal } from '../components/delete-modal/delete-modal';
import { Product } from '@app/models/product';
import { RouteName } from '@app/router/route';
import { Unsubscribe } from '@reduxjs/toolkit';
import { navigate } from '@app/router/router';
import { store } from '@app/state/store';

class Products {
  private content!: HTMLElement;
  private loading!: HTMLElement;
  private modal!: DeleteModal;
  private pagination!: OdsPagination & HTMLElement;
  private previousListStatus: ACTION_STATUS = ACTION_STATUS.idle;
  private previousDeleteStatus: ACTION_STATUS = ACTION_STATUS.idle;
  private selectedProduct?: Product;
  private table!: OdsTable & HTMLElement;
  private stateUnsubscribe?: Unsubscribe;

  async init() {
    this.setHtmlElement()

    this.pagination.addEventListener('odsChange', (async({ detail }: OdsPaginationCurrentChangeEvent) => {
      await this.loadList({ page: detail.current, perPage: detail.itemPerPage })
    }) as unknown as EventListener)

    this.modal.addEventListener('delete', () =>
      this.selectedProduct && store.dispatch(deleteProduct(this.selectedProduct.id))
    )

    await this.loadList({ page: await this.pagination.getCurrentPage(), perPage: this.pagination.defaultItemsPerPage })
  }

  destroy() {
    this.stateUnsubscribe?.()
    this.pagination.removeEventListener('odsChange', ((async ({ detail }: OdsPaginationCurrentChangeEvent) => {
      await this.loadList({ page: detail.current, perPage: detail.itemPerPage })
    })) as unknown as EventListener)

    this.modal.removeEventListener('delete', () =>
      this.selectedProduct && store.dispatch(deleteProduct(this.selectedProduct.id))
    )
    this.previousListStatus = ACTION_STATUS.idle;
    this.previousDeleteStatus = ACTION_STATUS.idle;
  }

  private async loadList({ page, perPage }: { page: number; perPage: number }) {
    await store.dispatch(list({ page, perPage }))
    this.stateUnsubscribe = store.subscribe(() => {
      const productsState = store.getState().products

      this.handlerListChange(productsState)
      this.handlerDeleteChange(productsState)
    })
  }

  private handlerListChange(productsState: ProductReducerState) {
    const hasListStatusChange = this.previousListStatus !== productsState.listStatus
    if (hasListStatusChange && productsState.listStatus === ACTION_STATUS.succeeded) {
      this.renderTable(productsState.products ?? [])
      this.pagination.totalItems = productsState.count
      this.loading.style.display = 'none'
      this.content.style.display = 'grid'
      this.pagination.style.display = 'flex'
    }
    if (hasListStatusChange && productsState.listStatus === ACTION_STATUS.pending) {
      this.loading.style.display = 'block'
      this.content.style.display = 'none'
      this.pagination.style.display = 'none'
    }
    this.previousListStatus = productsState.listStatus

  }

  private handlerDeleteChange(productsState: ProductReducerState) {
    const hasDeleteStatusChange = this.previousDeleteStatus !== productsState.deleteStatus
    if (hasDeleteStatusChange && productsState.deleteStatus === ACTION_STATUS.succeeded) {
      this.renderTable(productsState.products ?? [])
      this.pagination.totalItems = productsState.count
      this.loading.style.display = 'none'
      this.content.style.display = 'grid'
      this.pagination.style.display = 'flex'
    }
    this.previousDeleteStatus = productsState.deleteStatus
  }

  private renderTable(products: Product[]) {
    const rowTable = products.map((product) => `<tr>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <ods-medium height="60" alt="${product.title}" src="${product.thumbnail}"></ods-medium>
        </td>
        <td>
          <ods-button id="product-edit-item-${product.id}" variant="ghost" icon="pen"></ods-button>
          <ods-button id="product-delete-item-${product.id}" variant="ghost" icon="trash"></ods-button>
        </td>
      </tr>`).join(''),
      tbody = this.table.querySelector('tbody')
    if (tbody) {
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      tbody.innerHTML += rowTable
    }

    // Wait render
    nextTick(() => {
      products.forEach((product) => {
        const productDeleteItemButton = getQuerySelector(`#product-delete-item-${product.id}`)
        productDeleteItemButton.addEventListener('click', () => {
          this.modal.isOpen = true
          this.modal.productTitle = product.title
          this.selectedProduct = product
        })

        const productEditItemButton = getQuerySelector(`#product-edit-item-${product.id}`)
        productEditItemButton.addEventListener('click', () => {
          navigate(RouteName.EDIT_PRODUCTS, { ':id': product.id.toString() })
        })
      })
    })
  }

  private setHtmlElement() {
    this.content = getQuerySelector('.products__content')
    this.loading = getQuerySelector('.products__content--loading')
    this.modal = getQuerySelector('#products-delete-modal')
    this.table = getQuerySelector('#products-table')
    this.pagination = getQuerySelector('#products-pagination')
  }

  static loadTemplate(): string {
    return template
  }
}

export {
  Products,
}
