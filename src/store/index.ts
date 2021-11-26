import { configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';
// import cloneDeep from 'lodash/cloneDeep';
import { useDispatch } from 'react-redux';
import application from 'store/application/reducer';
// import transactions, { initialState as transactionsInitialState } from './transactions/reducer';

// const PERSISTED_KEYS:string[] = ['transactions'];
const PERSISTED_KEYS: string[] = ['test'];

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    application
    // transactions
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    preloadedState: {
      // application: cloneDeep(transactionsInitialState)
    }
  })
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch();

export default store;
