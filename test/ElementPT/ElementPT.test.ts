import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { Contract } from "ethers";

const { ethers } = require("hardhat");

import { addCurveLPOrcles } from "../Curve/helper";
import { ElementFi_Pools } from "../../helpers/constants";
import { deployMockElementFiPTPriceOracle, addElementPTOracles } from "./helper";
import { calcPTPrice } from "./elf-sdk/ptPrice";
import { addERC20TokenOracles, addLUSDOracle, deployPriceOracle } from "../lib";

////////////////////////////////////////////////////////////////////////////////////////////
/// @notice: This includes live comparing price using elf-sdk built by element.fi
/// https://github.com/element-fi/elf-sdk/tree/8ceb39b9f6933ff9567a522023fd979a29aeb69c
////////////////////////////////////////////////////////////////////////////////////////////

describe("Element PT PriceOracle test", function () {
  let priceOracle: Contract;
  let signers: SignerWithAddress[];

  it("test Element PT PriceOracle price", async () => {
    signers = await ethers.getSigners();
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);
    priceOracle = await addLUSDOracle(priceOracle);
    priceOracle = await addCurveLPOrcles(priceOracle);
    priceOracle = await addElementPTOracles(priceOracle);

    for (let i = 0; i < ElementFi_Pools.length; i++) {
      console.log(ElementFi_Pools[i].name, " : ");
      console.log(
        (
          await priceOracle.getPriceInUSD(ElementFi_Pools[i].ELEMENT_PRINCIPAL_TOKEN_POOL)
        ).toNumber()
      );
    }
  });

  it("compare with live AMM price", async () => {
    const oraclePrices = [];
    const ammPrices = [];
    signers = await ethers.getSigners();

    for (let i = 0; i < ElementFi_Pools.length; i++) {
      const elementPool = ElementFi_Pools[i];
      const { ptSpotPrice, blockTimestamp } = await calcPTPrice(
        elementPool.BALANCE_V2_VAULT,
        elementPool.ELEMENT_BASET_TOKENT,
        elementPool.ELEMENT_PRINCIPAL_TOKEN_POOL
      );

      const mockElementOracle = await deployMockElementFiPTPriceOracle([
        elementPool.BALANCE_V2_VAULT,
        elementPool.ELEMENT_PRINCIPAL_TOKEN_POOL,
        elementPool.BALANCE_POOL_ID,
        elementPool.BALANCE_POOL_TOKENS_DECIMALS,
        elementPool.ptIndex,
        elementPool.baseIndex,
        elementPool.convergentUintSecond,
        elementPool.convergentExpiration,
        blockTimestamp,
      ]);

      const oraclePrice =
        parseFloat((await mockElementOracle.latestAnswer()).toString()) / Math.pow(10, 8);

      oraclePrices.push(oraclePrice);
      ammPrices.push(ptSpotPrice);

      console.log(ElementFi_Pools[i].name, ": ");
      console.log("AMM: ", ammPrices[i], ", Oracle: ", oraclePrices[i]);
    }
  });
});
