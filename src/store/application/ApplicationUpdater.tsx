import { useCallback, useEffect } from 'react';
import { SUPER_FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import {
  useCurrentBlock,
  useGetBNBBalanceAndSyncToStoreCallback,
  useGetTrackingTokenBalancesAndSyncToStoreCallback,
  useUpdateCurrentBlockCallback,
} from 'store/application/hooks';
import useInterval from 'hooks/useInterval';
import useSimpleRpcProvider from 'hooks/useSimpleRpcProvider';

export default function ApplicationUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const getBNBBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const getTokenBalances = useGetTrackingTokenBalancesAndSyncToStoreCallback();
  const updateCurrentBlock = useUpdateCurrentBlockCallback();
  const currentBlock = useCurrentBlock();
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

  useInterval(callback, isWindowVisible ? SUPER_FAST_INTERVAL : null, false);

  useEffect(() => {
    const fetchData = () => {
      getBNBBalance();
      getTokenBalances();
    };

    if (isWindowVisible) {
      fetchData();
    }
  }, [isWindowVisible, getBNBBalance, getTokenBalances, currentBlock]);

  return null;
}
