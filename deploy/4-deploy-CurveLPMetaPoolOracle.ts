import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import dotenv from "dotenv";
dotenv.config();

import { Curve_Meta_Pools } from "../helpers/constants";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer, priceOracleAggregator } = await getNamedAccounts();

  if (!priceOracleAggregator) {
    console.error("Missing priceOracleAggregator contract address.");
  }

  const Crv3_DAI_USDC_USDT = Curve_Meta_Pools[0];

  // 3pools: DAI/USDC/USDC (3Crv)
  await deploy("CurveLPMetaPoolOracle", {
    from: deployer,
    args: [
      priceOracleAggregator,
      Crv3_DAI_USDC_USDT.registry,
      Crv3_DAI_USDC_USDT.lp,
      Crv3_DAI_USDC_USDT.pool,
      Crv3_DAI_USDC_USDT.tokensLength,
      Crv3_DAI_USDC_USDT.tokens,
    ],
    log: true,
  });
};

deploy.tags = ["CurveLPMetaPoolOracle"];
export default deploy;
