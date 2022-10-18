import { Contract } from "ethers";
import bn from "bignumber.js";

import { Balancer_V2_Pools } from "../../helpers/constants";
import { BPTV2PriceOracle, MockBPT2PriceOracle } from "../../types";
import { deployContract, preparePriceDeviationParams } from "../../helpers/lib";

export const deployBPTV2PriceOracle = async (
  vault: string,
  pool: string,
  poolId: string,
  weights: number[],
  decimals: number[],
  tokens: string[],
  priceOracle: string
) => {
  const params = await preparePriceDeviationParams(weights);

  return await deployContract<BPTV2PriceOracle>("BPTV2PriceOracle", [
    params.maxPriceDeviation,
    params.K,
    params.powerPrecision,
    params.approximationMatrix,
    vault,
    pool,
    poolId,
    decimals,
    weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
    tokens,
    priceOracle,
  ]);
};

export const deployMockBPT2PriceOracle = async (
  vault: string,
  pool: string,
  poolId: string,
  weights: number[],
  decimals: number[],
  tokens: string[],
  priceOracle: string
) => {
  const params = await preparePriceDeviationParams(weights);

  return await deployContract<MockBPT2PriceOracle>("MockBPT2PriceOracle", [
    params.maxPriceDeviation,
    params.K,
    params.powerPrecision,
    params.approximationMatrix,
    vault,
    pool,
    poolId,
    decimals,
    weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
    tokens,
    priceOracle,
  ]);
};

export const addBPTV2Oracles = async (priceOracle: Contract) => {
  for (let i = 0; i < Balancer_V2_Pools.length; i++) {
    const oracle = await deployBPTV2PriceOracle(
      Balancer_V2_Pools[i].vault,
      Balancer_V2_Pools[i].pool,
      Balancer_V2_Pools[i].poolId,
      Balancer_V2_Pools[i].weights,
      Balancer_V2_Pools[i].decimals,
      Balancer_V2_Pools[i].tokens,
      priceOracle.address
    );
    await priceOracle.updateOracleForAsset(Balancer_V2_Pools[i].pool, oracle.address);
  }
  return priceOracle;
};
