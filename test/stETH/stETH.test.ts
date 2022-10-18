import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { ethers } from "hardhat";

import { stETH, ERC20s } from "../../helpers/constants";
import { addERC20TokenOracles, deployPriceOracle } from "../lib";
import { deploySTETHOracle } from "./helper";

describe("stETH PriceOracle", function () {
  let priceOracle: Contract;
  let signers: SignerWithAddress[];
  let stETHOrale: Contract;

  it("StETHOracle usdPrice", async () => {
    signers = (await ethers.getSigners()) as any;

    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);

    stETHOrale = await deploySTETHOracle([stETH.priceFeed, priceOracle.address, 18, ERC20s.WETH]);

    console.log("stETHPriceOracle: ");
    console.log((await stETHOrale.latestAnswer()).toString());
  });
});
