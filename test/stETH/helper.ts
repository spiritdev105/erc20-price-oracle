import { deployContract } from "../../helpers/lib";
import { STETHOracle } from "../../types";

export const deploySTETHOracle = async (params: (string | number)[]) => {
  return await deployContract<STETHOracle>("STETHOracle", params);
};
