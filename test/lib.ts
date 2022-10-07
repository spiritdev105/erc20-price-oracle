import { Contract } from "ethers";

import { deployContract, timeTravel } from "../helpers/lib";
import { ChainlinkUSDAdapter, PriceOracleAggregator, STETHOracle } from "../types";
import { USD_ADAPTERs, ERC20s, Uniswap_V2_Pairs } from "../helpers/constants";
import { deployUniswapV2Oracle } from "./Uniswap/helper";

export const deployPriceOracle = async (owner: string) => {
  return await deployContract<PriceOracleAggregator>("PriceOracleAggregator", [owner]);
};

export const deploySTETHOracle = async (params: (string | number)[]) => {
  return await deployContract<STETHOracle>("STETHOracle", params);
};

export const addERC20TokenOracles = async (priceOracle: Contract) => {
  for (let i = 0; i < USD_ADAPTERs.length; i++) {
    const usdAdapter = await deployChainlinkUSDAdapter([
      USD_ADAPTERs[i].name,
      USD_ADAPTERs[i].symbol,
      USD_ADAPTERs[i].token,
      USD_ADAPTERs[i].aggregator,
    ]);
    await priceOracle.updateOracleForAsset(USD_ADAPTERs[i].token, usdAdapter.address);
  }
  return priceOracle;
};

export const deployChainlinkUSDAdapter = async (params: string[]) => {
  return await deployContract<ChainlinkUSDAdapter>("ChainlinkUSDAdapter", params);
};

export const addLUSDOracle = async (priceOracle: Contract) => {
  const FACTORY_ADDRESS = Uniswap_V2_Pairs[0].factory; // uniswapFactory for LUSD / WETH

  const UniswapV2Oracle = await deployUniswapV2Oracle([
    FACTORY_ADDRESS,
    ERC20s.LUSD,
    ERC20s.WETH,
    priceOracle.address,
  ]);

  // ensure that at least one full period has passed since the last update
  await timeTravel(60 * 60 * 24);
  await UniswapV2Oracle.update();

  await priceOracle.updateOracleForAsset(ERC20s.LUSD, UniswapV2Oracle.address);
  return priceOracle;
};
