import { BASE_BSC_SCAN_URLS, CHAIN_ID, nodes } from 'config/constants';
import { ChainId } from '@pancakeswap/sdk';

export default async function setupNetwork() {
  const provider = window.ethereum;
  if (provider?.request) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: `Binance Smart Chain ${CHAIN_ID === ChainId.MAINNET ? 'Mainnet' : 'Testnet'}`,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [BASE_BSC_SCAN_URLS[CHAIN_ID]],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
}
