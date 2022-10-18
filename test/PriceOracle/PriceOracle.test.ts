import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { ethers } from "hardhat";

import { deployPriceOracle } from "./helper";
import { addERC20TokenOracles, addLUSDOracle } from "./helper";
import { addBPTV2Oracles } from "../BPTV2/helper";
import { addCurveLPOrcles } from "../Curve/helper";
import { addElementPTOracles } from "../ElementPT/helper";
import {
  ERC20s,
  Curve_Meta_Pools,
  Balancer_V2_Pools,
  ElementFi_Pools,
  stETH,
} from "../../helpers/constants";
import { deploySTETHOracle } from "../stETH/helper";

describe("PriceOracel Test", function () {
  let priceOracle: Contract;
  let signers: SignerWithAddress[];

  before(async () => {
    signers = (await ethers.getSigners()) as any;
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);
    priceOracle = await addLUSDOracle(priceOracle);
    priceOracle = await addCurveLPOrcles(priceOracle);
    priceOracle = await addElementPTOracles(priceOracle);
    priceOracle = await addBPTV2Oracles(priceOracle);
  });

  it("LUSD token usdPrice", async () => {
    console.log("LUSD: ", (await priceOracle.getPriceInUSD(ERC20s.LUSD)).toString());
  });

  it("curve.fi MetaPool LPToken usdPrice", async () => {
    for (let i = 0; i < Curve_Meta_Pools.length; i++) {
      console.log(
        Curve_Meta_Pools[0].name,
        ": ",
        (await priceOracle.getPriceInUSD(Curve_Meta_Pools[0].lp)).toString()
      );
    }
  });

  it("BPTV2PriceOracle usdPrice", async () => {
    for (let i = 0; i < Balancer_V2_Pools.length; i++) {
      console.log(
        Balancer_V2_Pools[i].name,
        ": ",
        (await priceOracle.getPriceInUSD(Balancer_V2_Pools[i].pool)).toString()
      );
    }
  });

  it("Element Principal Token usdPrice", async () => {
    for (let i = 0; i < ElementFi_Pools.length; i++) {
      console.log(
        ElementFi_Pools[i].name,
        ": ",
        (
          await priceOracle.getPriceInUSD(ElementFi_Pools[i].ELEMENT_PRINCIPAL_TOKEN_POOL)
        ).toString()
      );
    }
  });

  it("stETH usdPrice", async () => {
    const stETHOrale = await deploySTETHOracle([
      stETH.priceFeed,
      priceOracle.address,
      18,
      ERC20s.WETH,
    ]);

    await priceOracle.updateOracleForAsset(ERC20s.SETH2, stETHOrale.address);
    console.log("stETHPriceOracle: ", await priceOracle.getPriceInUSD(ERC20s.SETH2));
  });
});
