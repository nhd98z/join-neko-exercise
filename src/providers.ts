import { ethers } from 'ethers';
import getRpcUrl from './getRpcUrl';

const RPC_URL = getRpcUrl();

const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL);

export default simpleRpcProvider;
