import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { CHAIN_ID } from 'config/constants';

export function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });
