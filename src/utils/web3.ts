import { Currency, ETHER, Token } from '@pancakeswap/sdk';

export function isToken(currency: Currency): currency is Token {
  return currency !== ETHER;
}
