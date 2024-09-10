import type { Product } from '../../models/product'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ACTION_STATUS } from '../../constant/slice'
import {
  count as countRequest,
  create as createRequest,
  deleteProduct as deleteProductRequest,
  getById as getByIdRequest,
  list as listRequest,
  update as updateRequest,
} from '../services/products'

type ProductReducerState = {
  createStatus: ACTION_STATUS,
  count?: number,
  countStatus: ACTION_STATUS,
  deleteStatus: ACTION_STATUS,
  getByIdStatus: ACTION_STATUS,
  listStatus: ACTION_STATUS,
  product?: Product,
  products?: Product[],
  updateStatus: ACTION_STATUS,
}

type ListActionPayload = {
  page?: number,
  perPage?: number,
}

const initialState: ProductReducerState = {
  createStatus: ACTION_STATUS.idle,
  count: undefined,
  countStatus: ACTION_STATUS.idle,
  deleteStatus: ACTION_STATUS.idle,
  getByIdStatus: ACTION_STATUS.idle,
  listStatus: ACTION_STATUS.idle,
  product: undefined,
  products: undefined,
  updateStatus: ACTION_STATUS.idle,
}

const create = createAsyncThunk('products/create', async (product: Product) => {
  return createRequest(product)
})

const count = createAsyncThunk('products/count', async () => {
  return countRequest()
})

const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
  return deleteProductRequest(id)
})

const getById = createAsyncThunk('products/getById', async (id: number) => {
  return getByIdRequest(id)
})

const list = createAsyncThunk('products/list', async ({ page, perPage }: ListActionPayload) => {
  return listRequest(page, perPage)
})

const update = createAsyncThunk('products/update', async (product: Product) => {
  return updateRequest(product)
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(create.fulfilled, (state, action) => {
        state.createStatus = ACTION_STATUS.succeeded
        state.product = action.payload
        state.products = (state.products || []).concat([action.payload])
      })
      .addCase(create.pending, (state) => {
        state.createStatus = ACTION_STATUS.pending
      })
      .addCase(create.rejected, (state) => {
        state.createStatus = ACTION_STATUS.failed
      })

      .addCase(count.fulfilled, (state, action) => {
        state.count = action.payload
        state.countStatus = ACTION_STATUS.succeeded
      })
      .addCase(count.pending, (state) => {
        state.countStatus = ACTION_STATUS.pending
      })
      .addCase(count.rejected, (state) => {
        state.countStatus = ACTION_STATUS.failed
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = ACTION_STATUS.succeeded
        state.products = (state.products || []).filter((product) => product.id !== action.payload)
        state.count = (state.count ?? 1) - 1
      })
      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = ACTION_STATUS.pending
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteStatus = ACTION_STATUS.failed
      })

      .addCase(getById.fulfilled, (state, action) => {
        state.product = action.payload
        state.getByIdStatus = ACTION_STATUS.succeeded
      })
      .addCase(getById.pending, (state) => {
        state.getByIdStatus = ACTION_STATUS.pending
      })
      .addCase(getById.rejected, (state) => {
        state.getByIdStatus = ACTION_STATUS.failed
      })

      .addCase(list.fulfilled, (state, action) => {
        state.count = action.payload.count,
        state.products = action.payload.products
        state.listStatus = ACTION_STATUS.succeeded
      })
      .addCase(list.pending, (state) => {
        state.listStatus = ACTION_STATUS.pending
      })
      .addCase(list.rejected, (state) => {
        state.listStatus = ACTION_STATUS.failed
      })

      .addCase(update.fulfilled, (state, action) => {
        state.product = action.payload
        state.products = (state.products || []).map((product) => (
          product.id === action.payload.id ? action.payload : product
        ))
        state.updateStatus = ACTION_STATUS.succeeded
      })
      .addCase(update.pending, (state) => {
        state.updateStatus = ACTION_STATUS.pending
      })
      .addCase(update.rejected, (state) => {
        state.updateStatus = ACTION_STATUS.failed
      })
  }
})

export {
  create,
  count,
  deleteProduct,
  getById,
  list,
  update,
}
export default productsSlice.reducer
