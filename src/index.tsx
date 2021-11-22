import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { InjectedConnector } from '@web3-react/injected-connector';
import { UnsupportedChainIdError, useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { setupNetwork } from './wallet';
import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

const injected = new InjectedConnector({ supportedChainIds: [97] });

function App() {
  // setup
  const { activate, account, library } = useWeb3React();
  // b1
  const [balance, setBalance] = useState('');
  // b2
  const [sca, setSca] = useState('');
  // b3
  const [ra, setRa] = useState('');
  const [amount, setAmount] = useState('');
  // b4
  const [txStatus, setTxStatus] = useState([]);

  const connect = () => {
    void activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork();
        if (hasSetup) {
          await activate(injected);
        }
      }
    });
  };

  useEffect(() => {
    (async () => {
      // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      if (account && library) {
        const signer = await library.getSigner();
        const b = await signer.getBalance();
        const bb = new BigNumber(b.toString());
        const bbb = bb.dividedBy(new BigNumber(1e18)).toString();
        setBalance(bbb);
      }
    })();
  }, [account, library]);

  return (
    <>
      <h1>b1: connect bsc testnet</h1>
      <p>account: {account || '--'}</p>
      <p>balance: {balance || '--'} BNB</p>
      <button
        onClick={() => {
          connect();
        }}
        disabled={!!account}
      >
        connect
      </button>

      <hr />

      <h1>b2: input smart contract address, output its information</h1>
      <input type="text" placeholder="Smart contract address" value={sca} onChange={(e) => setSca(e.target.value)} />
      <button onClick={() => {}}>show smart contract info</button>

      <hr />

      <h1>b3: send BNB to another address</h1>
      <input type="text" placeholder="Recipient address" value={ra} onChange={(e) => setRa(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={() => {}}>send</button>

      <hr />

      <h1>b4: follow transaction status</h1>
    </>
  );
}

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
);
