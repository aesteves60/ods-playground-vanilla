import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  signIn as signInRequest,
  signOut as signOutRequest,
} from '../services/session'
import { ACTION_STATUS } from '@app/constant/slice';

interface SignInPayload {
  password: string;
  username: string;
}

const signIn = createAsyncThunk('session/signIn', ({ password, username }: SignInPayload) => signInRequest(username, password))

const signOut = createAsyncThunk('session/signOut', () => signOutRequest())


const sessionReducer = createSlice({
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state) => {
        state.signInStatus = ACTION_STATUS.succeeded
        state.signOutStatus = ACTION_STATUS.idle
      })
      .addCase(signIn.pending, (state) => {
        state.signInStatus = ACTION_STATUS.pending
      })
      .addCase(signIn.rejected, (state) => {
        state.signInStatus = ACTION_STATUS.failed
      })

      .addCase(signOut.fulfilled, (state) => {
        state.signInStatus = ACTION_STATUS.idle
        state.signOutStatus = ACTION_STATUS.succeeded
      })
      .addCase(signOut.pending, (state) => {
        state.signOutStatus = ACTION_STATUS.pending
      })
      .addCase(signOut.rejected, (state) => {
        state.signOutStatus = ACTION_STATUS.failed
      })
  },
  initialState: {
    signInStatus: ACTION_STATUS.idle,
    signOutStatus: ACTION_STATUS.idle,
  },
  name: 'session',
  reducers: {},
})

export type {
  SignInPayload,
}

export {
  signIn,
  signOut,
}
export default sessionReducer.reducer
