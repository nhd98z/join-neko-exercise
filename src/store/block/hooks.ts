import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from 'store/index';
import { useCallback } from 'react';
import { updateCurrentBlock } from 'store/block';

export function useCurrentBlock() {
  const currentBlock = useSelector<AppState, AppState['block']['currentBlock']>((state) => state.block.currentBlock);

  return currentBlock;
}

export function useUpdateCurrentBlockCallback() {
  const dispatch = useAppDispatch();
  const currentBlock = useCurrentBlock();

  return useCallback(
    (newFetchedBlock: number) => {
      if (currentBlock !== newFetchedBlock) {
        dispatch(updateCurrentBlock({ newFetchedBlock }));
      }
    },
    [dispatch, currentBlock]
  );
}
