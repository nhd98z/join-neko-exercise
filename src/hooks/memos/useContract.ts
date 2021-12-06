import { useActiveWeb3React } from 'hooks/memos/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import bep20Abi from 'config/abi/bep20.json';
import { isAddress } from 'ethers/lib/utils';
import useSimpleRpcProvider from 'hooks/memos/useSimpleRpcProvider';

function useGetContractCallback() {
  const simpleRpcProvider = useSimpleRpcProvider();

  return useCallback(
    (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
      const signerOrProvider = signer ?? simpleRpcProvider;
      return new ethers.Contract(address, abi, signerOrProvider);
    },
    [simpleRpcProvider]
  );
}

function useGetBEP20Contracts() {
  const getContract = useGetContractCallback();

  return useCallback(
    (address: string, signer?: ethers.Signer | ethers.providers.Provider) => getContract(bep20Abi, address, signer),
    [getContract]
  );
}

export function useBEP20Contracts(addresses: string[]): (Contract | undefined)[] {
  const { account, library } = useActiveWeb3React();
  const getBEP20Contracts = useGetBEP20Contracts();

  return useMemo(
    () =>
      addresses.map((address) =>
        isAddress(address)
          ? getBEP20Contracts(address, account && library ? library.getSigner(account) : library)
          : undefined
      ),
    [addresses, account, library, getBEP20Contracts]
  );
}
