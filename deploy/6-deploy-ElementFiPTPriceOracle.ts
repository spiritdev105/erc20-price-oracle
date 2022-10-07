import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import dotenv from "dotenv";
dotenv.config();

import { ElementFi_Pools } from "../helpers/constants";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;
  const { deployer, priceOracleAggregator } = await getNamedAccounts();

  if (!priceOracleAggregator) {
    console.error("Missing priceOracleAggregator contract address.");
  }

  const ElementFiPt_yvCurveLUSD_28SEP21 = ElementFi_Pools[0];

  await deploy("ElementFiPTPriceOracle", {
    from: deployer,
    args: [
      ElementFiPt_yvCurveLUSD_28SEP21.BALANCE_V2_VAULT,
      ElementFiPt_yvCurveLUSD_28SEP21.ELEMENT_PRINCIPAL_TOKEN_POOL,
      ElementFiPt_yvCurveLUSD_28SEP21.ELEMENT_BASET_TOKENT,
      ElementFiPt_yvCurveLUSD_28SEP21.BALANCE_POOL_ID,
      ElementFiPt_yvCurveLUSD_28SEP21.BALANCE_POOL_TOKENS_DECIMALS,
      ElementFiPt_yvCurveLUSD_28SEP21.ptIndex,
      ElementFiPt_yvCurveLUSD_28SEP21.baseIndex,
      ElementFiPt_yvCurveLUSD_28SEP21.convergentUintSecond,
      ElementFiPt_yvCurveLUSD_28SEP21.convergentExpiration,
      priceOracleAggregator,
    ],
    log: true,
  });
};

deploy.tags = ["ElementFiPTPriceOracle"];
export default deploy;
