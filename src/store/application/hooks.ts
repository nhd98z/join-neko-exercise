import { AppState, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { updateBNBBalance, updateCurrentBlock, updateTokenBalance } from 'store/application';
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
  const trackingTokenBalances = useSelector<AppState, AppState['application']['trackingTokenBalances']>(
    (state) => state.application.trackingTokenBalances
  );

  return useMemo(
    () =>
      Object.keys(trackingTokenBalances).reduce(
        (acc: { address: string; balance: BigNumber.Instance | null | undefined }[], address) => [
          ...acc,
          { address, balance: trackingTokenBalances[address] },
        ],
        []
      ),
    [trackingTokenBalances]
  );
}

export function useTrackingTokenBalance(address?: string): BigNumber | null | undefined {
  const trackingTokenBalance = useSelector<AppState, AppState['application']['trackingTokenBalances']>(
    (state) => state.application.trackingTokenBalances
  )[address ?? ''];
  return useMemo(() => trackingTokenBalance && new BigNumber(trackingTokenBalance), [trackingTokenBalance]);
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

export function useCurrentBlock() {
  const currentBlock = useSelector<AppState, AppState['application']['currentBlock']>(
    (state) => state.application.currentBlock
  );

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
