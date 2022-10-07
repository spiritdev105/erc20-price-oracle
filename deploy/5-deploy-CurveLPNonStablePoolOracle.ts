import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import bn from "bignumber.js";

import dotenv from "dotenv";
dotenv.config();

import { Curve_NonStable_Pools } from "../helpers/constants";
import { preparePriceDeviationParams } from "../helpers/lib";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer, priceOracleAggregator } = await getNamedAccounts();

  if (!priceOracleAggregator) {
    console.error("Missing priceOracleAggregator contract address.");
  }

  const tricryptoPool = Curve_NonStable_Pools[0];
  const weights = [0.33, 0.33, 0.33];
  const decimals = [6, 8, 18];
  const params = await preparePriceDeviationParams(weights);

  // tricrypto (USD-BTC-ETH)
  await deploy("CurveLPNonStablePoolOracle", {
    from: deployer,
    args: [
      params.maxPriceDeviation,
      params.K,
      params.powerPrecision,
      params.approximationMatrix,
      tricryptoPool.lp,
      tricryptoPool.pool,
      decimals,
      weights.map((w) => new bn(10).pow(18).multipliedBy(new bn(w)).toString()),
      tricryptoPool.tokens,
      priceOracleAggregator,
    ],
    log: true,
  });
};

deploy.tags = ["CurveLPNonStablePoolOracle"];
export default deploy;
