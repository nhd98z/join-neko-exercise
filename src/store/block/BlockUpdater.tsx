import { useCallback } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import { useUpdateCurrentBlockCallback } from 'store/block/hooks';
import useInterval from 'hooks/useInterval';
import useSimpleRpcProvider from 'hooks/useSimpleRpcProvider';

export default function BlockUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const updateCurrentBlock = useUpdateCurrentBlockCallback();
  const simpleRpcProvider = useSimpleRpcProvider();

  const callback = useCallback(() => {
    const fetchBlock = async () => {
      if (simpleRpcProvider) {
        const newFetchedBlock = await simpleRpcProvider.getBlockNumber();
        updateCurrentBlock(newFetchedBlock);
      }
    };

    fetchBlock();
  }, [simpleRpcProvider, updateCurrentBlock]);

  useInterval(callback, isWindowVisible ? FAST_INTERVAL : null, false);

  return null;
}
