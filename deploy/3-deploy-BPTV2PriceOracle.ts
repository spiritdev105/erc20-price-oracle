import bn from "bignumber.js";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import dotenv from "dotenv";
dotenv.config();

import { Balancer_V2_Pools } from "../helpers/constants";
import { preparePriceDeviationParams } from "../helpers/lib";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy, get },
    getNamedAccounts,
  } = hre;
  const { deployer, priceOracleAggregator } = await getNamedAccounts();

  if (!priceOracleAggregator) {
    console.error("Missing priceOracleAggregator contract address.");
  }

  const BTC50_WETH50_Pool = Balancer_V2_Pools[0];
  const params = await preparePriceDeviationParams(BTC50_WETH50_Pool.weights);

  await deploy("BPTV2PriceOracle", {
    from: deployer,
    args: [
      params.maxPriceDeviation,
      params.K,
      params.powerPrecision,
      params.approximationMatrix,
      BTC50_WETH50_Pool.vault,
      BTC50_WETH50_Pool.pool,
      BTC50_WETH50_Pool.poolId,
      BTC50_WETH50_Pool.decimals,
      BTC50_WETH50_Pool.weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
      BTC50_WETH50_Pool.tokens,
      priceOracleAggregator,
    ],
    log: true,
  });
};

deploy.tags = ["BPTV2PriceOracle"];
export default deploy;
