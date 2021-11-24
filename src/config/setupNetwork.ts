import { CHAIN_ID, nodes } from 'config/constants';

const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider?.request) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18
            },
            rpcUrls: nodes,
            blockExplorerUrls: ['https://testnet.bscscan.com']
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error('Can\'t setup the BSC network on metamask because window.ethereum is undefined');
    return false;
  }
};

export default setupNetwork;
