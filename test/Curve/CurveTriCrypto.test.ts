import { Contract } from "ethers";

import { deployCurveTriCryptoOracle } from "./helper";
import { Curve_Tricrypto } from "../../helpers/constants";

describe("CurveTriCryptoOracle Test", function () {
  let priceOracle: Contract;

  it("check curve metaPool LP Tokens", async () => {
    priceOracle = await deployCurveTriCryptoOracle(Curve_Tricrypto.lpPrice);

    console.log(Curve_Tricrypto.name, " : ");
    console.log((await priceOracle.latestAnswer()).toNumber());
  });
});
