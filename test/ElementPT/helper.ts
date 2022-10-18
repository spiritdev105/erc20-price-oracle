import { Contract } from "ethers";

import { MockElementFiPTPriceOracle, ElementFiPTPriceOracle } from "../../types";
import { deployContract, timeTravel } from "../../helpers/lib";
import { ElementFi_Pools } from "../../helpers/constants";

export const deployMockElementFiPTPriceOracle = async (params: any[]) => {
  return await deployContract<MockElementFiPTPriceOracle>("MockElementFiPTPriceOracle", params);
};

export const deployElementFiPTPriceOracle = async (params: any[]) => {
  return await deployContract<ElementFiPTPriceOracle>("ElementFiPTPriceOracle", params);
};

export const addElementPTOracles = async (priceOracle: Contract) => {
  for (let i = 0; i < ElementFi_Pools.length; i++) {
    const elementPool = ElementFi_Pools[i];
    const oracle = await deployElementFiPTPriceOracle([
      elementPool.BALANCE_V2_VAULT,
      elementPool.ELEMENT_PRINCIPAL_TOKEN_POOL,
      elementPool.ELEMENT_BASET_TOKENT,
      elementPool.BALANCE_POOL_ID,
      elementPool.BALANCE_POOL_TOKENS_DECIMALS,
      elementPool.ptIndex,
      elementPool.baseIndex,
      elementPool.convergentUintSecond,
      elementPool.convergentExpiration,
      priceOracle.address,
    ]);
    await timeTravel(60 * 60 * 24);
    await oracle.update();
    await priceOracle.updateOracleForAsset(
      elementPool.ELEMENT_PRINCIPAL_TOKEN_POOL,
      oracle.address
    );
  }
  return priceOracle;
};
