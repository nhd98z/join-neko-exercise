import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useMemo } from 'react';
import { Contract, ethers } from 'ethers';
import { simpleRpcProvider } from 'config/constants';
import bep20Abi from 'config/abi/erc20.json';
import { isAddress } from 'ethers/lib/utils';

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer);
};

const useBEP20Contract = (address: string): Contract | undefined => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => (isAddress(address) ? getBep20Contract(address, library!.getSigner()) : undefined),
    [address, library]
  );
};

export { useBEP20Contract };
