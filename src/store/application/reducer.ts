import { createReducer } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { updateBNBBalance } from 'store/application/actions';

export interface IApplicationState {
  bnbBalance?: BigNumber.Instance;
}

export const initialState: IApplicationState = {
  bnbBalance: undefined
};

export default createReducer<IApplicationState>(initialState, (builder) => {
  builder.addCase(updateBNBBalance, (state, { payload: { bnbBalance } }) => {
    state.bnbBalance = bnbBalance;
  });
});
