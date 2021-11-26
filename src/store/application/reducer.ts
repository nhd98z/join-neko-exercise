import { createReducer } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { updateBNBBalance } from 'store/application/actions';

export interface ApplicationState {
  bnbBalance?: BigNumber.Instance;
}

export const initialState: ApplicationState = {
  bnbBalance: undefined
};

export default createReducer<ApplicationState>(initialState, (builder) => {
  builder.addCase(updateBNBBalance, (state, { payload: { bnbBalance } }) => {
    state.bnbBalance = bnbBalance;
  });
});
