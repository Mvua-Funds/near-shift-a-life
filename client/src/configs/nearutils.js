
import { BigNumber } from "bignumber.js"
import { CONTRACT, TOKEN_DETAILS, WHITELISTEDTOKENS_ } from "./appconfig";
import getConfig from './near/config';

const BN = require("bn.js")
const nearAPI = require("near-api-js");
const { utils, providers } = nearAPI
const config = getConfig("testnet")

export const calculateNear = (yoctoNear) => {
  if (yoctoNear) {
    const yoctos = new BigNumber(yoctoNear).toFixed()
    return nearAPI.utils.format.formatNearAmount(yoctos)
  }
  return "0"
}

export const getYoctoNear = (near) => {
  if (near) {
    // const nears = new BigNumber(near).toFixed()
    return nearAPI.utils.format.parseNearAmount(near)
  }
  return "0"
}

export const getTokenDecimals = (tokenId) => {
  if (Object.keys(TOKEN_DETAILS).includes(tokenId)) {
    return TOKEN_DETAILS[tokenId].decimals
  }
  return 0
}

export const getTokenDetails = (tokenId) => {
  const token = WHITELISTEDTOKENS_.find(token => token.address === tokenId)
  return token;
}

export const getReadableTokenBalance = (tokenBalance, decimals) => {
  return new BigNumber(tokenBalance).dividedBy(10 ** decimals).toFixed(2)
}

export const BigNumberCompare = (num1, num2) => {
  return new BigNumber(num1).isLessThan(num2)
}

export const resolveToken = (tokenId) => {
  if (Object.keys(TOKEN_DETAILS).includes(tokenId)) {
    return TOKEN_DETAILS[tokenId].name
  }
  return tokenId.split('.')[0]
}

export const getUSD = (amt, price) => {
  return price * amt
}

export const getAmtString = (amt, decimals) => {
  return new BigNumber(amt).multipliedBy(10 ** decimals).toFixed();
}

export const getTokenPrice = async (tokenId) => {
  return fetch(`https://testnet-indexer.ref-finance.com/get-token-price?token_id=${tokenId}`,
    {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }
  )
    .then((res) => res.json())
    .then((priceBody) => {
      return priceBody
    })
    .catch((err) => {
      return "N/A"
    })
};


export const makeTokens = (tokensObject) => {
  const tokens_ = []
  if (tokensObject) {
    Object.keys(tokensObject).map(key => {
      tokens_.push({
        tokenId: key,
        balance: tokensObject[key]
      })
    })
  }
  return tokens_
}

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

export const getGas = (gas) =>
  gas ? new BN(gas) : new BN('100000000000000');

export const getAmount = (amount) =>
  amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');


export const getUserWalletTokens = async () => {
  return await fetch(
    config.helperUrl +
    '/account/' +
    window?.walletConnection?.getAccountId() +
    '/likelyTokens',
    {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }
  )
    .then((res) => res.json())
    .then((tokens) => {
      return tokens;
    });
};

export const ShiftALifeFunctionCall = (wallet, {
  methodName,
  args,
  gas,
  amount,
}) => {
  return wallet
    .account()
    .functionCall(
      CONTRACT,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

export const ShiftALifeViewFunctionCall = (wallet, {
  methodName,
  args,
}) => {
  return wallet.account().viewFunction(CONTRACT, methodName, args);
};

export async function getState(txHash, accountId) {
  const provider = new providers.JsonRpcProvider(
    config.provider
  );
  const result = await provider.txStatus(txHash, accountId);
  return result
}

export const convertResultToText = (response) => {
  const res = JSON.parse(
    response.result.map((x) => String.fromCharCode(x)).join('')
  );
  return res
}

export const convertTimestamp = (timestamp) => {
  const date = new Date(timestamp/1000000);
  return date.toDateString()
}


export const makeArray = (object) => {
  const array = []
  if (object) {
    Object.keys(object).map(key => {
      array.push({
        name: key,
        votes: object[key]
      })
    })
  }
  return array
}