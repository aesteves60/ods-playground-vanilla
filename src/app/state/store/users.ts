import type { User } from '../../models/user'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ACTION_STATUS } from '../../constant/slice'
import {
  count as countRequest,
  create as createRequest,
  deleteUser as deleteUserRequest,
  getById as getByIdRequest,
  list as listRequest,
  update as updateRequest,
} from '../services/users'

type UserReducerState = {
  createStatus: ACTION_STATUS,
  count?: number,
  countStatus: ACTION_STATUS,
  deleteStatus: ACTION_STATUS,
  getByIdStatus: ACTION_STATUS,
  listStatus: ACTION_STATUS,
  user?: User,
  users?: User[],
  updateStatus: ACTION_STATUS,
}

type ListActionPayload = {
  page?: number,
  perPage?: number,
}

const initialState: UserReducerState = {
  createStatus: ACTION_STATUS.idle,
  count: undefined,
  countStatus: ACTION_STATUS.idle,
  deleteStatus: ACTION_STATUS.idle,
  getByIdStatus: ACTION_STATUS.idle,
  listStatus: ACTION_STATUS.idle,
  user: undefined,
  users: undefined,
  updateStatus: ACTION_STATUS.idle,
}

const create = createAsyncThunk('users/create', async (user: User) => {
  return createRequest(user)
})

const count = createAsyncThunk('users/count', async () => {
  return countRequest()
})

const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
  return deleteUserRequest(id)
})

const getById = createAsyncThunk('users/getById', async (id: number) => {
  return getByIdRequest(id)
})

const list = createAsyncThunk('users/list', async ({ page, perPage }: ListActionPayload) => {
  return listRequest(page, perPage)
})

const update = createAsyncThunk('users/update', async (user: User) => {
  return updateRequest(user)
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(create.fulfilled, (state, action) => {
        state.createStatus = ACTION_STATUS.succeeded
        state.user = action.payload
        state.users = (state.users || []).concat([action.payload])
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

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = ACTION_STATUS.succeeded
        state.users = (state.users || []).filter((user) => user.id !== action.payload)
        state.count = (state.count ?? 1) - 1
      })
      .addCase(deleteUser.pending, (state) => {
        state.deleteStatus = ACTION_STATUS.pending
      })
      .addCase(deleteUser.rejected, (state) => {
        state.deleteStatus = ACTION_STATUS.failed
      })

      .addCase(getById.fulfilled, (state, action) => {
        state.user = action.payload
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
        state.users = action.payload.users
        state.listStatus = ACTION_STATUS.succeeded
      })
      .addCase(list.pending, (state) => {
        state.listStatus = ACTION_STATUS.pending
      })
      .addCase(list.rejected, (state) => {
        state.listStatus = ACTION_STATUS.failed
      })

      .addCase(update.fulfilled, (state, action) => {
        state.user = action.payload
        state.users = (state.users || []).map((user) => (
          user.id === action.payload.id ? action.payload : user
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
  deleteUser,
  getById,
  list,
  update,
}
export default usersSlice.reducer
