import { expect } from "chai";
import { BigNumber } from "ethers";

import { deployContract } from "../../helpers/lib";
import { ERC20s, Uniswap_V3_Pools } from "../../helpers/constants";
import { USDUniV3Oracle, WETHUniV3Oracle } from "../../types";
import { findPoolForToken } from "./helper";

describe("UniswapV3Oracle", function () {
  // it("initialize an oracle for sETH2", async () => {
  //   const uniV3Oracle = await deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //     Uniswap_V3_Pools.SETH2_WETH,
  //     Uniswap_V3_Pools.USDC_WETH,
  //     ERC20s.WETH,
  //     false,
  //   ]);
  //   const viewPrice = await uniV3Oracle.latestAnswer();
  //   console.log(viewPrice.toString());
  // });
  // it("initialize an oracle for Curve DAO token (CRV)", async () => {
  //   const uniV3Oracle = await deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //     Uniswap_V3_Pools.WETH_CRV,
  //     Uniswap_V3_Pools.USDC_WETH,
  //     ERC20s.WETH,
  //     false,
  //   ]);
  //   const viewPrice = await uniV3Oracle.latestAnswer();
  //   // See if the price is between 1-2 dollars, as should be the case for CRV
  //   console.log(viewPrice.toString());
  //   expect(viewPrice.gt(BigNumber.from(10).pow(8))).to.be.true;
  //   expect(viewPrice.lt(BigNumber.from(20).pow(8))).to.be.true;
  // });
  // it("should revert with no liquidity", async () => {
  //   await expect(
  //     deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //       Uniswap_V3_Pools.WETH_FREEBRIT,
  //       Uniswap_V3_Pools.USDC_WETH,
  //       ERC20s.WETH,
  //       false,
  //     ])
  //   ).to.be.revertedWith("UV3_NO_LIQUIDITY");
  // });
  // it("should revert not a WETH pair", async () => {
  //   await expect(
  //     deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //       Uniswap_V3_Pools.BUSD_USDC,
  //       Uniswap_V3_Pools.USDC_WETH,
  //       ERC20s.WETH,
  //       false,
  //     ])
  //   ).to.be.revertedWith("UV3_WETH_NOT_LISTED");
  // });
  // it("initialize and get USD price for LUSD", async () => {
  //   const pool = await findPoolForToken(ERC20s.LUSD);
  //   if (!pool.address) {
  //     return console.log("Not pool for token LUSD");
  //   }
  //   if (pool.ref == "WETH") {
  //     const WETHPair = await deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //       pool.address,
  //       Uniswap_V3_Pools.USDC_WETH,
  //       ERC20s.WETH,
  //       pool.type == "base",
  //     ]);
  //     const hopPrice = await WETHPair.latestAnswer();
  //     console.log("hop price", hopPrice.toString());
  //   } else {
  //     const USDCPair = await deployContract<USDUniV3Oracle>("USDUniV3Oracle", [
  //       pool.address,
  //       pool.type == "base",
  //     ]);
  //     const price = await USDCPair.latestAnswer();
  //     console.log("price", price.toString());
  //   }
  // });
  // it("initialize and get USD price for WETH", async () => {
  //   const USDCPair = await deployContract<USDUniV3Oracle>("USDUniV3Oracle", [
  //     Uniswap_V3_Pools.USDC_WETH,
  //     false,
  //   ]);
  //   const price = await USDCPair.latestAnswer();
  //   console.log("price", price.toString());
  // });
  // it("initialize and get USD price for WBTC", async () => {
  //   const pool = await findPoolForToken(ERC20s.WBTC);
  //   if (pool.ref == "WETH") {
  //     const WETHPair = await deployContract<WETHUniV3Oracle>("WETHUniV3Oracle", [
  //       pool.address,
  //       Uniswap_V3_Pools.USDC_WETH,
  //       ERC20s.WETH,
  //       pool.type == "base",
  //     ]);
  //     const hopPrice = await WETHPair.latestAnswer();
  //     console.log("hop price", hopPrice.toString());
  //   } else {
  //     const USDCPair = await deployContract<USDUniV3Oracle>("USDUniV3Oracle", [
  //       pool.address,
  //       pool.type == "base",
  //     ]);
  //     const price = await USDCPair.latestAnswer();
  //     console.log("price", price.toString());
  //   }
  // });
});
