import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import dotenv from "dotenv";
dotenv.config();

import { Uniswap_V3_Pools, ERC20s } from "../helpers/constants";

// Deploy an oracle for the Curve token
const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("WETHUniV3Oracle", {
    from: deployer,
    args: [Uniswap_V3_Pools.WETH_CRV, Uniswap_V3_Pools.USDC_WETH, ERC20s.WETH, false],
    libraries: {},
    log: true,
  });
};

deploy.tags = ["WETHUniV3Oracle"];
export default deploy;
