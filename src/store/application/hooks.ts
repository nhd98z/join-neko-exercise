import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { updateBNBBalance, updateTokenBalance } from 'store/application';
import { ethersToBigNumberInstance } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useArrayTrackingTokens } from 'store/tokens/hooks';
import { useArrayBEP20Contracts } from 'hooks/useContract';
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

export function useTrackingTokenBalances(): { [address: string]: BigNumber.Instance | null | undefined } {
  return useSelector<AppState, AppState['application']['trackingTokenBalances']>(
    (state) => state.application.trackingTokenBalances
  );
}

// For iterating convenient.
export function useArrayTrackingTokenBalances(): { address: string; balance: BigNumber.Instance | null | undefined }[] {
  const tokenBalances = useSelector<AppState, AppState['application']['trackingTokenBalances']>(
    (state) => state.application.trackingTokenBalances
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

export function useTrackingTokenBalance(address?: string): BigNumber | null | undefined {
  const tokenBalance = useSelector<AppState, AppState['application']['trackingTokenBalances']>(
    (state) => state.application.trackingTokenBalances
  )[address ?? ''];
  return useMemo(() => tokenBalance && new BigNumber(tokenBalance), [tokenBalance]);
}

export function useGetTrackingTokenBalancesAndSyncToStoreCallback() {
  const { account } = useActiveWeb3React();
  const trackingTokens = useArrayTrackingTokens();
  const trackingTokenAddresses = trackingTokens.map(({ address }) => address);
  const contracts = useArrayBEP20Contracts(trackingTokenAddresses);
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
