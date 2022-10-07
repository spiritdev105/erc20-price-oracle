import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/src/signers";
import { ethers } from "hardhat";

import { deployUniswapV2Oracle } from "./helper";
import { addERC20TokenOracles, deployPriceOracle } from "../lib";
import { timeTravel } from "../../helpers/lib";
import { Uniswap_V2_Pairs } from "../../helpers/constants";

describe("UniswapV2Oracle", function () {
  let UniswapV2Oracle: Contract;
  let signers: SignerWithAddress[];
  let priceOracle: Contract;
  let INVALID_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

  it("create new uniswapv2 oracle", async () => {
    signers = (await ethers.getSigners()) as any;
    priceOracle = await deployPriceOracle(signers[0].address);
    priceOracle = await addERC20TokenOracles(priceOracle);

    await expect(
      deployUniswapV2Oracle([
        Uniswap_V2_Pairs[0].factory,
        INVALID_CONTRACT_ADDRESS,
        Uniswap_V2_Pairs[0].tokenB,
        priceOracle.address,
      ])
    ).to.be.revertedWith("UNIV2_TOKENA");

    await expect(
      deployUniswapV2Oracle([
        Uniswap_V2_Pairs[0].factory,
        Uniswap_V2_Pairs[0].tokenA,
        INVALID_CONTRACT_ADDRESS,
        priceOracle.address,
      ])
    ).to.be.revertedWith("UNIV2_TOKENB");

    await expect(
      deployUniswapV2Oracle([
        INVALID_CONTRACT_ADDRESS,
        Uniswap_V2_Pairs[0].tokenA,
        Uniswap_V2_Pairs[0].tokenB,
        priceOracle.address,
      ])
    ).to.be.revertedWith("UNIV2_FACTORY");

    await expect(
      deployUniswapV2Oracle([
        Uniswap_V2_Pairs[0].factory,
        Uniswap_V2_Pairs[0].tokenA,
        Uniswap_V2_Pairs[0].tokenB,
        INVALID_CONTRACT_ADDRESS,
      ])
    ).to.be.revertedWith("UNIV2_AGGREGATOR");

    UniswapV2Oracle = await deployUniswapV2Oracle([
      Uniswap_V2_Pairs[0].factory,
      Uniswap_V2_Pairs[1].tokenA,
      Uniswap_V2_Pairs[1].tokenB,
      priceOracle.address,
    ]);
  });

  it("check DAI and LUSD price", async () => {
    // ensure that at least one full period has passed since the last update
    await timeTravel(60 * 60 * 24);

    await UniswapV2Oracle.update();

    console.log(Uniswap_V2_Pairs[0].name);
    console.log((await UniswapV2Oracle.latestAnswer()).toString());
  });
});
