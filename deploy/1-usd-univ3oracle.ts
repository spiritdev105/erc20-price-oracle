import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import dotenv from "dotenv";
dotenv.config();

import { Uniswap_V3_Pools } from "../helpers/constants";

// Deploy an oracle for the Curve token
const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("USDUniV3Oracle", {
    from: deployer,
    args: [Uniswap_V3_Pools.WBTC_USDC, true],
    libraries: {},
    log: true,
  });
};

deploy.tags = ["USDUniV3Oracle"];
export default deploy;
