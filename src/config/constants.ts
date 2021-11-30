import { ethers } from 'ethers';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { ChainId } from '@pancakeswap/sdk';

export const CHAIN_ID: ChainId = +process.env.REACT_APP_CHAIN_ID!;

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
};

const NODE_1 = process.env.REACT_APP_NODE_1!;
const NODE_2 = process.env.REACT_APP_NODE_2!;
const NODE_3 = process.env.REACT_APP_NODE_3!;
const NODE_4 = process.env.REACT_APP_NODE_4!;
const NODE_5 = process.env.REACT_APP_NODE_5!;
const NODE_6 = process.env.REACT_APP_NODE_6!;
export const nodes = [NODE_1, NODE_2, NODE_3, NODE_4, NODE_5, NODE_6];

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(_.sample(nodes));

export const FAST_INTERVAL = 6000;

export const BIG_TEN = new BigNumber(10);
