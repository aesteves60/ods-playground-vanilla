import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import productsReducer from 'app/state/slices/products'
import sessionReducer from './store/session'
// import usersReducer from 'app/state/slices/users'

const combinedReducer = combineReducers({
  // products: productsReducer,
  session: sessionReducer,
  // users: usersReducer,
})

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: combinedReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export { store }