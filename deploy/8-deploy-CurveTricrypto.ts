import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import dotenv from "dotenv";
dotenv.config();

import { Curve_Tricrypto } from "../helpers/constants";

// Deploy an oracle for the Curve token
const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deployments.deploy("CurveTriCryptoOracle", {
    from: deployer,
    args: [Curve_Tricrypto.lpPrice],
    libraries: {},
    log: true,
  });
};

deploy.tags = ["CurveTriCryptoOracle"];
export default deploy;
