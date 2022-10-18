import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";

const { ethers } = require("hardhat");

import { deployBPTV2PriceOracle, deployMockBPT2PriceOracle } from "./helper";
import { addERC20TokenOracles, deployPriceOracle } from "../lib";
import { Balancer_V2_Pools } from "../../helpers/constants";

describe("BPTV2PriceOracle Test", function () {
  let signers: SignerWithAddress[];
  let priceOracle: Contract;

  it("check BPTV2 tokens price", async () => {
    signers = await ethers.getSigners();
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);

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
      console.log(Balancer_V2_Pools[i].name, "(Real) : ");
      console.log((await oracle.latestAnswer()).toNumber());
    }
  });

  it("compare getArithmeticMean & getWeightedGeometricMean with mock balances", async () => {
    for (let i = 0; i < Balancer_V2_Pools.length; i++) {
      const mockOracle = await deployMockBPT2PriceOracle(
        Balancer_V2_Pools[i].vault,
        Balancer_V2_Pools[i].pool,
        Balancer_V2_Pools[i].poolId,
        Balancer_V2_Pools[i].weights,
        Balancer_V2_Pools[i].decimals,
        Balancer_V2_Pools[i].tokens,
        priceOracle.address
      );
      console.log(Balancer_V2_Pools[i].name, "(Mock) : ");
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
