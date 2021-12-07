import { useEffect, useRef } from 'react';
import { FAST_INTERVAL } from 'config/constants';
import useIsWindowVisible from 'hooks/memos/useIsWindowVisible';
import {
  useGetBNBBalanceAndSyncToStoreCallback,
  useGetTokenBalancesAndSyncToStoreCallback,
} from 'store/application/hooks';

export default function ApplicationUpdater() {
  const isWindowVisible = useIsWindowVisible();
  const timer = useRef<any>(null);
  const getBNBBalance = useGetBNBBalanceAndSyncToStoreCallback();
  const getTokenBalances = useGetTokenBalancesAndSyncToStoreCallback();

  useEffect(() => {
    const fetchData = () => {
      getBNBBalance();
      getTokenBalances();
    };

    if (isWindowVisible) {
      fetchData();
      timer.current = setInterval(fetchData, FAST_INTERVAL); // TODO: Chưa tối ưu: interval mới chạy mà fetch vẫn chưa xong.
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [isWindowVisible, getBNBBalance, getTokenBalances]);

  return null;
}
