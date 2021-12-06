import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useActiveWeb3React } from 'hooks/memos/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { updateBNBBalance, updateTokenBalance } from 'store/application/actions';
import { ethersToBigNumberInstance } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useArrayTrackingTokens } from 'store/tokens/hooks';
import { useBEP20Contracts } from 'hooks/memos/useContract';
import { Contract } from 'ethers';

/*********************************  BNB  *********************************/

export function useBNBBalance(): BigNumber | undefined {
  const bnbBalance = useSelector<AppState, AppState['application']['bnbBalance']>(
    (state) => state.application.bnbBalance
  );
  return useMemo(() => bnbBalance && new BigNumber(bnbBalance), [bnbBalance]);
}

export function useGetBNBBalanceAndSyncToStoreCallback() {
  const { account, library } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  return useCallback(() => {
    const getBNBBalanceAndSyncToStore = async () => {
      if (account && library) {
        const signer = library.getSigner(account);
        const weiBalance = await signer.getBalance();
        dispatch(updateBNBBalance({ bnbBalance: ethersToBigNumberInstance(weiBalance) }));
      }
    };
    getBNBBalanceAndSyncToStore();
  }, [account, dispatch, library]);
}

/*********************************  Token  *********************************/

export function useTokenBalances(): { [address: string]: BigNumber.Instance | null | undefined } {
  return useSelector<AppState, AppState['application']['tokenBalances']>((state) => state.application.tokenBalances);
}

// For iterating convenient.
export function useArrayTokenBalances(): { address: string; balance: BigNumber.Instance | null | undefined }[] {
  const tokenBalances = useSelector<AppState, AppState['application']['tokenBalances']>(
    (state) => state.application.tokenBalances
  );

  return useMemo(
    () =>
      Object.keys(tokenBalances).reduce(
        (acc: { address: string; balance: BigNumber.Instance | null | undefined }[], address) => [
          ...acc,
          { address, balance: tokenBalances[address] },
        ],
        []
      ),
    [tokenBalances]
  );
}

export function useTokenBalance(address?: string): BigNumber | null | undefined {
  const tokenBalance = useSelector<AppState, AppState['application']['tokenBalances']>(
    (state) => state.application.tokenBalances
  )[address ?? ''];
  return useMemo(() => tokenBalance && new BigNumber(tokenBalance), [tokenBalance]);
}

export function useGetTokenBalancesAndSyncToStoreCallback() {
  const { account } = useActiveWeb3React();
  const trackingTokens = useArrayTrackingTokens();
  const trackingTokenAddresses = trackingTokens.map(({ address }) => address);
  const contracts = useBEP20Contracts(trackingTokenAddresses);
  const dispatch = useAppDispatch();

  return useCallback(() => {
    const getTokenBalanceAndSyncToStore = async (address: string, contract: Contract | undefined) => {
      if (account && contract) {
        const balance = await contract.balanceOf(account);
        dispatch(updateTokenBalance({ address, balance: ethersToBigNumberInstance(balance) }));
      }

      return undefined;
    };

    const promises = contracts.map((contract, index) =>
      getTokenBalanceAndSyncToStore(trackingTokenAddresses[index], contract)
    );

    Promise.allSettled(promises);
  }, [account, contracts, dispatch, trackingTokenAddresses]);
}
