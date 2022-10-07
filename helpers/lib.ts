import { Contract } from "ethers";
import Decimal from "decimal.js";

const hre = require("hardhat");

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[],
  libraries?: {}
) => {
  const signers = await hre.ethers.getSigners();
  const contract = (await (
    await hre.ethers.getContractFactory(contractName, signers[0], {
      libraries: {
        ...libraries,
      },
    })
  ).deploy(...args)) as ContractType;

  return contract;
};

export const preparePriceDeviationParams = async (weights: number[]) => {
  const MAX_PRICE_DEVIATION = "50000000000000000";
  const ether = "1000000000000000000";

  const divisor = weights.reduce<Decimal>((acc, w, i) => {
    if (i == 0) {
      return new Decimal(w).pow(w);
    }
    return acc.mul(new Decimal(w).pow(w));
  }, new Decimal("0"));

  const K = new Decimal(ether).div(divisor).toFixed(0);

  let matrix: string[][] = [];
  for (let y = 1; y <= 20; y++) {
    const elements = [new Decimal(10).pow(y).times(ether).toFixed(0)];
    for (let wI = 0; wI < weights.length; wI++) {
      elements.push(new Decimal(10).pow(y).pow(weights[wI]).times(ether).toFixed(0));
    }
    matrix.push(elements);
  }

  return {
    maxPriceDeviation: MAX_PRICE_DEVIATION,
    K,
    powerPrecision: "100000000",
    approximationMatrix: matrix,
  };
};

export const timeTravel = async (seconds: number) => {
  await hre.network.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.send("evm_mine", []);
};
