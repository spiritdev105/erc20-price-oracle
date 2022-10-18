import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";

const { ethers } = require("hardhat");

import { Curve_Meta_Pools } from "../../helpers/constants";
import { addCurveLPOrcles } from "./helper";
import { addERC20TokenOracles, deployPriceOracle, addLUSDOracle } from "../lib";

describe("CurveLPMetaPoolOracle Test", function () {
  let signers: SignerWithAddress[];
  let priceOracle: Contract;

  it("check curve metaPool LP Tokens", async () => {
    signers = await ethers.getSigners();
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);
    priceOracle = await addLUSDOracle(priceOracle);
    priceOracle = await addCurveLPOrcles(priceOracle);

    for (let i = 0; i < Curve_Meta_Pools.length; i++) {
      console.log(Curve_Meta_Pools[i].name, " : ");
      console.log((await priceOracle.getPriceInUSD(Curve_Meta_Pools[i].lp)).toNumber());
    }
  });
});
