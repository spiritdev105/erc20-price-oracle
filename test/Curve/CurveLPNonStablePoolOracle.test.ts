import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";

const { ethers } = require("hardhat");

import { deployCurveLPNonStablePoolOracle, deployMockCurveLPNonStablePoolOracle } from "./helper";
import { Curve_NonStable_Pools } from "../../helpers/constants";
import { addERC20TokenOracles, deployPriceOracle } from "../lib";

describe("CurveLPNonStablePoolOracle Test", function () {
  let priceOracle: Contract;
  let signers: SignerWithAddress[];

  it("Curve.Fi Curve_NonStable_Pools LP token Price", async () => {
    signers = await ethers.getSigners();
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);

    for (let i = 0; i < Curve_NonStable_Pools.length; i++) {
      const oracle = await deployCurveLPNonStablePoolOracle(
        Curve_NonStable_Pools[i].lp,
        Curve_NonStable_Pools[i].pool,
        Curve_NonStable_Pools[i].decimals,
        Curve_NonStable_Pools[i].weights,
        Curve_NonStable_Pools[i].tokens,
        priceOracle.address
      );

      console.log(Curve_NonStable_Pools[i].name, "(Real) : ");
      console.log((await oracle.latestAnswer()).toNumber());
    }
  });

  it("compare getArithmeticMean & getWeightedGeometricMean with mock balances", async () => {
    for (let i = 0; i < Curve_NonStable_Pools.length; i++) {
      const mockOracle = await deployMockCurveLPNonStablePoolOracle(
        Curve_NonStable_Pools[i].lp,
        Curve_NonStable_Pools[i].pool,
        Curve_NonStable_Pools[i].decimals,
        Curve_NonStable_Pools[i].weights,
        Curve_NonStable_Pools[i].tokens,
        priceOracle.address
      );

      console.log(Curve_NonStable_Pools[i].name, "(Mock) : ");
      console.log((await mockOracle.latestAnswer()).toNumber());

      const twoPrices = await mockOracle.getComparePrices();
      console.log(
        twoPrices[0].toNumber(),
        "(getArithmeticMean), ",
        twoPrices[1].toNumber(),
        "(getWeightedGeometricMean)"
      );
    }
  });
});
