import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { updateBNBBalance } from 'store/application/actions';
import { ethersToBigNumberInstance } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';

export function useBNBBalance(): BigNumber | undefined {
  const { bnbBalance } = useSelector<AppState, AppState['application']>((state) => state.application);
  return useMemo(() => bnbBalance && new BigNumber(bnbBalance), [bnbBalance]);
}

export function useGetBalanceCallback(): () => Promise<void> {
  const { account, library } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    if (account && library) {
      const signer = library.getSigner();
      const weiBalance = await signer.getBalance();
      dispatch(updateBNBBalance({ bnbBalance: ethersToBigNumberInstance(weiBalance) }));
    }
  }, [account, dispatch, library]);
}
