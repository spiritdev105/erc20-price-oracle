import bn from "bignumber.js";
import { GraphQLClient } from "graphql-request";

import { UniswapV2Oracle } from "../../types";
import { deployContract } from "../../helpers/lib";
import { FindPoolForTokenQuery, getSdk, PoolFragmentFragment } from "../../codegen";

export const deployUniswapV2Oracle = async (params: string[]) => {
  return await deployContract<UniswapV2Oracle>("UniswapV2Oracle", params);
};

const client = new GraphQLClient(
  "https://gateway.thegraph.com/api/9ddb9df47d91c01b1f3451ea7340a89d/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2"
);
export const sdk = getSdk(client);

export const findPoolForToken = async (token: string): Promise<PoolValues> => {
  const pools = await sdk.FindPoolForToken({ token });
  const pool = findMostLiquidPool(pools);
  return pool;
};

type PoolValues = {
  address: string;
  ref: "WETH" | "USDC";
  type: "quote" | "base";
  tick: number;
  liquidity: number;
  decimals: number;
};

function findLiquidPool(
  basePools: PoolFragmentFragment[],
  quotePools: PoolFragmentFragment[],
  ref: "WETH" | "USDC" | "USDT"
): PoolValues {
  basePools = basePools.filter((b) => b.liquidity != 0);
  quotePools = quotePools.filter((b) => b.liquidity != 0);
  let basePool = basePools.reduce((acc, cur) => {
    if (!acc) return cur;
    return cur.liquidity > acc?.liquidity ? cur : acc;
  }, basePools[0]);
  let quotePool = quotePools.reduce((acc, cur) => {
    if (!acc) return cur;
    return cur.liquidity > acc?.liquidity ? cur : acc;
  }, quotePools[0]);
  return (basePool?.liquidity || 0) > (quotePool?.liquidity || 0)
    ? ({
        address: basePool?.id,
        type: "base",
        ref,
        liquidity: basePool?.liquidity || 0,
        tick: basePool?.tick,
        decimals: basePool?.token0?.decimals,
      } as PoolValues)
    : ({
        address: quotePool?.id,
        type: "quote",
        ref,
        liquidity: quotePool?.liquidity || 0,
        tick: quotePool?.tick,
        decimals: quotePool?.token1?.decimals,
      } as PoolValues);
}

// From all the pools returned, return the one with the highest liquidity
function findMostLiquidPool(pools: FindPoolForTokenQuery): PoolValues {
  const WETHPool = findLiquidPool(pools.baseWETH, pools.quoteWETH, "WETH");
  const USDCPool = findLiquidPool(pools.baseUSDC, pools.quoteUSDC, "USDC");
  const USDTPool = findLiquidPool(pools.baseUSDT, pools.quoteUSDT, "USDT");
  return [WETHPool, USDCPool, USDTPool].reduce(
    (acc, cur) => {
      return acc.liquidity > cur.liquidity ? acc : cur;
    },
    { liquidity: 0 } as any
  );
}

export function getPriceFromTick(baseAmount: bn, tick: bn): bn {
  const sqrtRatioX96 = getSqrtPriceRatio(tick);
  const sqrtRatioX192 = sqrtRatioX96.multipliedBy(sqrtRatioX96);
  return sqrtRatioX192.multipliedBy(baseAmount).div(new bn(2).pow(192));
}

export function getSqrtPriceRatio(tick: bn): bn {
  const bt = new bn(1.0001);
  const sqrtPrice = bt.pow(tick.div(2)).multipliedBy(new bn(2).pow(96));
  return sqrtPrice;
}
