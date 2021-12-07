import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useCallback, useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import bep20Abi from 'config/abi/bep20.json';
import { isAddress } from 'ethers/lib/utils';
import useSimpleRpcProvider from 'hooks/useSimpleRpcProvider';

export function useGetContractCallback() {
  const simpleRpcProvider = useSimpleRpcProvider();

  return useCallback(
    (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider): Contract | undefined => {
      const signerOrProvider = signer ?? simpleRpcProvider;
      if (signerOrProvider === undefined) return undefined;
      return new ethers.Contract(address, abi, signerOrProvider);
    },
    [simpleRpcProvider]
  );
}

export function useGetBEP20ContractCallback() {
  const { account, library } = useActiveWeb3React();
  const getContract = useGetContractCallback();

  return useCallback(
    (address: string): Contract | undefined =>
      getContract(bep20Abi, address, account && library ? library.getSigner(account) : library),
    [getContract, account, library]
  );
}

export function useArrayBEP20Contracts(addresses: string[]): (Contract | undefined)[] {
  const getBEP20Contract = useGetBEP20ContractCallback();

  return useMemo(
    () => addresses.map((address) => (isAddress(address) ? getBEP20Contract(address) : undefined)),
    [addresses, getBEP20Contract]
  );
}
