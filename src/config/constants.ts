import { ethers } from 'ethers';
import _ from 'lodash';

export const CHAIN_ID = +process.env.REACT_APP_CHAIN_ID!;

const NODE_1 = process.env.REACT_APP_NODE_1!;
const NODE_2 = process.env.REACT_APP_NODE_2!;
const NODE_3 = process.env.REACT_APP_NODE_3!;
const NODE_4 = process.env.REACT_APP_NODE_4!;
const NODE_5 = process.env.REACT_APP_NODE_5!;
const NODE_6 = process.env.REACT_APP_NODE_6!;

export const nodes = [NODE_1, NODE_2, NODE_3, NODE_4, NODE_5, NODE_6];

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(_.sample(nodes));

export const FAST_INTERVAL = 6000;
