import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import dotenv from "dotenv";
dotenv.config();

import { STETH } from "../helpers/constants";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy, get },
    getNamedAccounts,
  } = hre;
  const { deployer, priceOracleAggregator } = await getNamedAccounts();

  if (!priceOracleAggregator) {
    console.error("Missing priceOracleAggregator contract address.");
  }

  // stETHOracle
  await deploy("STETHOracle", {
    from: deployer,
    args: [STETH.priceFeed, priceOracleAggregator, STETH.decimals, STETH.WETH],
    log: true,
  });
};

deploy.tags = ["STETHOracle"];
export default deploy;
