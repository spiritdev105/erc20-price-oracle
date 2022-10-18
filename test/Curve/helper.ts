import { Contract } from "ethers";
import bn from "bignumber.js";

import {
  CurveLPNonStablePoolOracle,
  CurveLPMetaPoolOracle,
  MockCurveLPNonStablePoolOracle,
  CurveTriCryptoOracle,
} from "../../types";
import { deployContract, preparePriceDeviationParams } from "../../helpers/lib";
import { Curve_Meta_Pools, Curve_NonStable_Pools } from "../../helpers/constants";

export const deployCurveTriCryptoOracle = async (lpPrice: string) => {
  return await deployContract<CurveTriCryptoOracle>("CurveTriCryptoOracle", [lpPrice]);
};

export const deployCurveLPMetaPoolOracle = async (params: any[]) => {
  return await deployContract<CurveLPMetaPoolOracle>("CurveLPMetaPoolOracle", params);
};

export const deployCurveLPNonStablePoolOracle = async (
  lp: string,
  pool: string,
  decimals: number[],
  weights: number[],
  tokens: string[],
  priceOracle: string
) => {
  const params = await preparePriceDeviationParams(weights);
  return await deployContract<CurveLPNonStablePoolOracle>("CurveLPNonStablePoolOracle", [
    params.maxPriceDeviation,
    params.K,
    params.powerPrecision,
    params.approximationMatrix,
    lp,
    pool,
    decimals,
    weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
    tokens,
    priceOracle,
  ]);
};

export const addCurveLPOrcles = async (priceOracle: Contract) => {
  for (let i = 0; i < Curve_Meta_Pools.length; i++) {
    const curve = Curve_Meta_Pools[i];
    const curveLpOracle = await deployCurveLPMetaPoolOracle([
      priceOracle.address,
      curve.registry,
      curve.lp,
      curve.pool,
      curve.tokensLength,
      curve.tokens,
    ]);
    await priceOracle.updateOracleForAsset(curve.lp, curveLpOracle.address);
  }

  // prepare Curve_NonStable_Pools
  for (let i = 0; i < Curve_NonStable_Pools.length; i++) {
    const curve = Curve_NonStable_Pools[i];
    const curveLpOracle = await deployCurveLPNonStablePoolOracle(
      curve.lp,
      curve.pool,
      curve.decimals,
      curve.weights,
      curve.tokens,
      priceOracle.address
    );
    await priceOracle.updateOracleForAsset(curve.lp, curveLpOracle.address);
  }

  return priceOracle;
};

export const deployMockCurveLPNonStablePoolOracle = async (
  lp: string,
  pool: string,
  decimals: number[],
  weights: number[],
  tokens: string[],
  priceOracle: string
) => {
  const params = await preparePriceDeviationParams(weights);
  return await deployContract<MockCurveLPNonStablePoolOracle>("MockCurveLPNonStablePoolOracle", [
    params.maxPriceDeviation,
    params.K,
    params.powerPrecision,
    params.approximationMatrix,
    lp,
    pool,
    decimals,
    weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
    tokens,
    priceOracle,
  ]);
};
