// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "../math/BNum.sol";
import "./DataTypes.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title  PriceDeviationLibrary
/// @author @conlot-crypto
/// @notice check if the liquidty has price deviation (like flashloan attack)
////////////////////////////////////////////////////////////////////////////////////////////

library PriceDeviationLibrary {
    uint256 public constant EXPAND = 10**10;

    /**
     * Returns true if there is a price deviation.
     * @param usdTotals Balance of each token in usd.
     * @param params variables to calculate price deviation
     */
    function hasDeviation(uint256[] memory usdTotals, DataTypes.PriceDeviationParams memory params)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < params.tokenLength; i++) {
            for (uint256 o = 0; o < params.tokenLength; o++) {
                if (i != o) {
                    uint256 priceDeviation = BNum.bdiv(
                        BNum.bdiv(usdTotals[i], params.weights[i]),
                        BNum.bdiv(usdTotals[o], params.weights[o])
                    );
                    if (
                        priceDeviation > (BNum.BONE + params.maxPriceDeviation) ||
                        priceDeviation < (BNum.BONE - params.maxPriceDeviation)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Calculates the price of the pool token using the formula of weighted geometric mean.
     * @param usdTotals Balance of each token in usd.
     * @param params variables to calculate price deviation
     */
    function getWeightedGeometricMean(
        uint256[] memory usdTotals,
        uint256 totalSupply,
        DataTypes.PriceDeviationParams memory params
    ) internal view returns (uint256) {
        uint256 mult = BNum.BONE;
        for (uint256 i = 0; i < params.tokenLength; i++) {
            mult = BNum.bmul(mult, getWeightedUSDBalanceByToken(i, usdTotals[i], params));
        }
        return uint256(BNum.bdiv(BNum.bmul(mult, params.K), totalSupply));
    }

    /**
     * Using the matrix approximation, returns a near base and exponentiation result, for num ^ weights[index]
     * @param index Token index.
     * @param num Base to approximate.
     * @param approximationMatrix Approximation matrix for gas optimization
     */
    function getClosestBaseAndExponetation(
        uint256 index,
        uint256 num,
        uint256[][] memory approximationMatrix
    ) internal view returns (uint256, uint256) {
        for (uint256 i = 0; i < approximationMatrix.length; i++) {
            if (approximationMatrix[i][0] >= num) {
                return (approximationMatrix[i][0], approximationMatrix[i][index + 1]);
            }
        }
        return (0, 0);
    }

    /**
     * Returns the weighted token balance in ethers by calculating the balance in ether of the token to the power of its weight.
     * @param index Token index.
     * @param usdTotal Balance of index token in usd.
     * @param params variables to calculate price deviation
     */
    function getWeightedUSDBalanceByToken(
        uint256 index,
        uint256 usdTotal,
        DataTypes.PriceDeviationParams memory params
    ) internal view returns (uint256) {
        uint256 weight = params.weights[index];
        (uint256 base, uint256 result) = getClosestBaseAndExponetation(
            index,
            usdTotal,
            params.approximationMatrix
        );

        if (base == 0 || usdTotal < BNum.MAX_BPOW_BASE) {
            if (usdTotal < BNum.MAX_BPOW_BASE) {
                return BNum.bpowApprox(usdTotal, weight, params.powerPrecision);
            } else {
                return
                    BNum.bmul(
                        usdTotal,
                        BNum.bpowApprox(
                            BNum.bdiv(BNum.BONE, usdTotal),
                            (BNum.BONE - weight),
                            params.powerPrecision
                        )
                    );
            }
        } else {
            return
                BNum.bmul(
                    result,
                    BNum.bpowApprox(BNum.bdiv(usdTotal, base), weight, params.powerPrecision)
                );
        }
    }
}
