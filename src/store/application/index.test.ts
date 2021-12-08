import reducer, { updateBNBBalance } from 'store/application';
import { ethersToBigNumberInstance } from 'utils/bigNumber';
import { ethers } from 'ethers';

test('Return initial state of application', () => {
  expect(reducer(undefined, {})).toEqual({
    bnbBalance: undefined,
    trackingTokenBalances: {},
  });
});

test('Update BNB balance', () => {
  const previousState = {
    bnbBalance: undefined,
    trackingTokenBalances: {},
  };

  const balanceInWei = ethers.utils.parseEther('123');
  const newBNBBalance = ethersToBigNumberInstance(balanceInWei);

  const expectedBNBBalance = ethersToBigNumberInstance(ethers.BigNumber.from('123000000000000000000'));

  expect(reducer(previousState, updateBNBBalance({ bnbBalance: newBNBBalance }))).toEqual({
    bnbBalance: expectedBNBBalance,
    trackingTokenBalances: {},
  });
});
