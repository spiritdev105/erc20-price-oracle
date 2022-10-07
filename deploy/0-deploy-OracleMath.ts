import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const accounts = await getNamedAccounts();
  await deployments.deploy("OracleMath", { from: accounts.deployer, log: true });
};

deploy.tags = ["OracleMath"];
export default deploy;
