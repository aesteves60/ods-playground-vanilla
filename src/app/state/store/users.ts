import {
  count as countRequest,
  create as createRequest,
  deleteUser as deleteUserRequest,
  getById as getByIdRequest,
  list as listRequest,
  update as updateRequest,
} from '../services/users'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ACTION_STATUS } from '@app/constant/slice'
import type { User } from '@app/models/user'

interface UserReducerState {
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

interface ListActionPayload {
  page?: number,
  perPage?: number,
}

const initialState: UserReducerState = {
  count: undefined,
  countStatus: ACTION_STATUS.idle,
  createStatus: ACTION_STATUS.idle,
  deleteStatus: ACTION_STATUS.idle,
  getByIdStatus: ACTION_STATUS.idle,
  listStatus: ACTION_STATUS.idle,
  updateStatus: ACTION_STATUS.idle,
  user: undefined,
  users: undefined,
}

const create = createAsyncThunk('users/create', async (user: User) => createRequest(user))

const count = createAsyncThunk('users/count', async () => countRequest())

const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => deleteUserRequest(id))

const getById = createAsyncThunk('users/getById', async (id: number) => getByIdRequest(id))

const list = createAsyncThunk('users/list', async ({ page, perPage }: ListActionPayload) => listRequest(page, perPage))

const update = createAsyncThunk('users/update', async (user: User) => updateRequest(user))

const usersSlice = createSlice({
  // eslint-disable-next-line max-lines-per-function
  extraReducers(builder) {
    builder
      .addCase(create.fulfilled, (state, action) => {
        state.createStatus = ACTION_STATUS.succeeded
        state.user = action.payload
        state.users = (state.users ?? []).concat([action.payload])
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
        state.users = (state.users ?? []).filter((user) => user.id !== action.payload)
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
        state.count = action.payload.count
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
        state.users = (state.users ?? []).map((user) => (
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
  },
  initialState,
  name: 'users',
  reducers: {},
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
