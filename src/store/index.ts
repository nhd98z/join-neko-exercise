import { configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';
import cloneDeep from 'lodash/cloneDeep';
import { useDispatch } from 'react-redux';
import application from 'store/application';
import block from 'store/block';
import transactions, { initialState as transactionsInitialState } from 'store/transactions';
import tokens, { initialState as tokenInitialState } from 'store/tokens';

const PERSISTED_KEYS: string[] = ['transactions', 'tokens'];

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    application,
    block,
    transactions,
    tokens,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    preloadedState: {
      transactions: cloneDeep(transactionsInitialState),
      tokens: cloneDeep(tokenInitialState),
    },
  }),
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
