import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlockState {
  currentBlock: number;
}

export const initialState: BlockState = {
  currentBlock: 0,
};

const applicationSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    updateCurrentBlock: (state, action: PayloadAction<{ newFetchedBlock: number }>) => {
      state.currentBlock = action.payload.newFetchedBlock;
    },
  },
});

export const { updateCurrentBlock } = applicationSlice.actions;

export default applicationSlice.reducer;
