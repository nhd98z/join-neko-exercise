import { useActiveWeb3React } from 'hooks/useActiveWeb3React';
import { useRef, useState } from 'react';
import { useBNBBalance } from 'store/application/hooks';
import { getFullDisplayBalance } from 'utils/bigNumber';
import {
  useAddTransactionReceiptCallback,
  useClearAllTransactionReceiptsCallback,
  useTransactionReceipts,
} from 'store/transactions/hooks';
import { injected } from 'config/web3';
import { UnsupportedChainIdError } from '@web3-react/core';
import setupNetwork from 'config/setupNetwork';
import { isAddress } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import useBep20ContractInfo from 'hooks/useBEP20ContractInfo';
import { Box } from 'components/Box';

export default function Func() {
  const { activate, account, library } = useActiveWeb3React();
  const addTransactionReceipt = useAddTransactionReceiptCallback();
  const clearAllTransactionReceipts = useClearAllTransactionReceiptsCallback();

  // b1
  const balance = useBNBBalance();
  const formattedBalance = balance ? getFullDisplayBalance(balance) : '--';

  // b2
  const BEP20AddressRef = useRef<HTMLInputElement>(null);
  const [BEP20Address, setBEP20Address] = useState('');
  const { name, symbol, decimals } = useBep20ContractInfo(BEP20Address) ?? {};

  // b3
  const recipientAddressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // b4
  const transactionReceipts = useTransactionReceipts();

  return (
    <Box style={{ maxWidth: '800px', margin: '100px auto 0' }}>
      <p>b1: connect bsc testnet</p>
      <p>account: {account || '--'}</p>
      <p>balance: {formattedBalance} BNB</p>
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

      <p>b2: input bep20 smart contract address, output its information</p>
      <input type="text" placeholder="Smart contract address" ref={BEP20AddressRef} />
      <p>
        Example:{' '}
        <a href="https://testnet.bscscan.com/token/0x82f1ffcdb31433b63aa311295a69892eebcdc2bb">
          0x82f1ffcdb31433b63aa311295a69892eebcdc2bb
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
          if (account && library && amountRef.current && recipientAddressRef.current) {
            const recipientAddress = recipientAddressRef.current.value;
            const amount = new BigNumber(amountRef.current.value);

            if (!isAddress(recipientAddress)) {
              alert('Invalid address.');
              return;
            }
            if (balance && amount.isGreaterThan(balance)) {
              alert('Value cannot greater than balance.');
              return;
            }

            const signer = library.getSigner(account);
            const transactionResponse: ethers.providers.TransactionResponse = await signer.sendTransaction({
              from: account ?? undefined,
              to: recipientAddress,
              value: ethers.utils.parseEther(amountRef.current.value),
            });
            addTransactionReceipt(transactionResponse.hash);
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
