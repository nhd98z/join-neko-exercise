import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useMemo, useRef, useState } from 'react';
import { useBNBBalance, useTokenBalances } from 'store/application/hooks';
import { getFullDisplayBalance } from 'utils/bigNumber';
import { useClearAllTransactionReceiptsCallback, useTransactionReceipts } from 'store/transactions/hooks';
import { injected } from 'config/web3';
import { UnsupportedChainIdError } from '@web3-react/core';
import setupNetwork from 'config/setupNetwork';
import { isAddress } from 'ethers/lib/utils';
import { Box } from 'components/Box';
import useSendBNBCallback from 'hooks/useSendBNB';
import { useAddTrackingTokenCallback, useArrayTrackingTokens } from 'store/tokens/hooks';
import useTokens from 'hooks/useTokens';
import BigNumber from 'bignumber.js';

export default function Func() {
  const renderTime = useRef(0);
  // console.log(`Func render: ${++renderTime.current}`);

  // b1
  const { activate, account } = useActiveWeb3React();
  const balance = useBNBBalance();
  const formattedBalance = balance ? getFullDisplayBalance(balance) : '--';
  const trackingToken = useArrayTrackingTokens();
  const tokenBalances = useTokenBalances();

  // b2
  const BEP20AddressRef = useRef<HTMLInputElement>(null);
  const [BEP20Address, setBEP20Address] = useState('');
  const memorizedBEP20Address = useMemo(() => [BEP20Address], [BEP20Address]);
  const { name, symbol, decimals } = useTokens(memorizedBEP20Address)[0] ?? {};
  const addTrackingToken = useAddTrackingTokenCallback();

  // b3
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const sendBNB = useSendBNBCallback();

  // b4
  const transactionReceipts = useTransactionReceipts();
  const clearAllTransactionReceipts = useClearAllTransactionReceiptsCallback();

  return (
    <Box style={{ maxWidth: '800px', margin: 'auto' }}>
      <p>b1: connect bsc testnet</p>
      <p>account: {account || '--'}</p>
      <p>balance: {formattedBalance} BNB</p>
      {trackingToken.map(({ address, token }) => {
        if (!token) return null;
        const tokenBalance = tokenBalances[address];
        return (
          <p key={address}>
            balance: {tokenBalance ? getFullDisplayBalance(new BigNumber(tokenBalance)) : '--'} {token.symbol}
          </p>
        );
      })}
      <button
        type="button"
        onClick={() => {
          activate(injected, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork();
              if (hasSetup) {
                await activate(injected);
              }
            }
          });
        }}
        disabled={!!account}
      >
        connect
      </button>

      <hr />

      <p>b2: input bep20 smart contract address, output its information, and add it to tracking token list</p>
      <input type="text" placeholder="Smart contract address" ref={BEP20AddressRef} />
      <p>
        Example:{' '}
        <a href="https://testnet.bscscan.com/token/0x82f1ffcdb31433b63aa311295a69892eebcdc2bb">
          0x230e23f0744fE767aa628Fcbb6F079087DF23C1C
        </a>
      </p>
      <p>name: {name ?? '--'}</p>
      <p>symbol: {symbol ?? '--'}</p>
      <p>decimals: {decimals ?? '--'}</p>
      <button
        type="button"
        onClick={() => {
          if (BEP20AddressRef.current) {
            if (isAddress(BEP20AddressRef.current.value)) {
              setBEP20Address(BEP20AddressRef.current.value);
              addTrackingToken(BEP20AddressRef.current.value);
            } else {
              alert('Address not valid.');
            }
          }
        }}
      >
        show smart contract info
      </button>

      <hr />

      <p>b3: send BNB to another address</p>
      <p>Example: 0xDa0D8fF1bE1F78c5d349722A5800622EA31CD5dd</p>
      <input type="text" placeholder="Recipient address" ref={recipientAddressRef} />
      <input type="number" placeholder="Amount" ref={amountRef} step="0.01" min="0.01" />
      <button
        type="button"
        onClick={async () => {
          if (amountRef.current && recipientAddressRef.current) {
            sendBNB(recipientAddressRef.current.value, amountRef.current.value);
          }
        }}
        disabled={!account}
      >
        send
      </button>

      <hr />

      <p>b4: follow transaction status</p>
      <button type="button" onClick={clearAllTransactionReceipts}>
        clear
      </button>
      {transactionReceipts.map((transactionReceipt) => (
        <p key={transactionReceipt.transactionHash}>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://testnet.bscscan.com/tx/${transactionReceipt.transactionHash}`}
          >
            {transactionReceipt.transactionHash}
          </a>
          :{' '}
          <span
            style={{
              color: transactionReceipt.status === 0 ? 'red' : transactionReceipt.status === 1 ? 'green' : 'grey',
            }}
          >
            {transactionReceipt.status === 0 ? 'Failed' : transactionReceipt.status === 1 ? 'Success' : 'Pending'}
          </span>
        </p>
      ))}
    </Box>
  );
}
