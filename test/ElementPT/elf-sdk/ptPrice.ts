import { ethers } from 'hardhat';

import { getTotalSupply } from './src/helpers/getTotalSupply';
import { getReserves } from './src/helpers/getReserves';
import { calcSpotPricePt, calcSpotPriceYt } from './src/helpers/calcSpotPrice';
import { getTimeUntilExpiration } from './src/helpers/getTimeUntilExpiration';
import { getLatestBlockTimestamp } from './src/helpers/getLatestBlockTimestamp';
import { getUnitSeconds } from './src/helpers/getUnitSeconds';

export const calcPTPrice = async (
  balVault: string,
  base: string,
  ptPool: string
) => {
  const [signer] = await ethers.getSigners();

  const totalSupply = await getTotalSupply(ptPool, signer);
  let reserves = await getReserves(ptPool, balVault, signer);
  const ptIndex = reserves.tokens[0].toLowerCase() == base ? 1 : 0;
  let baseIndex = reserves.tokens[0].toLowerCase() == base ? 0 : 1;
  const ptReserves = reserves.balances[ptIndex];
  let baseReserves = reserves.balances[baseIndex];
  const baseDecimals = reserves.decimals[baseIndex];
  const blockTimestamp = await getLatestBlockTimestamp();
  const timeRemainingSeconds = await getTimeUntilExpiration(
    ptPool,
    signer,
    blockTimestamp
  );
  const unitSeconds = await getUnitSeconds(ptPool, signer);
  const ptSpotPrice = calcSpotPricePt(
    baseReserves.toString(),
    ptReserves.toString(),
    totalSupply.toString(),
    timeRemainingSeconds,
    unitSeconds,
    baseDecimals
  );

  return { ptSpotPrice, blockTimestamp };
};
