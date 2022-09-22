// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "../math/PRBMathSD59x18.sol";
import "../interfaces/IUniswapV2Pair.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapV2Library
/// @author uniswap
/// @notice replace uniswap FixedPoint library with PRBMathSD59x18
////////////////////////////////////////////////////////////////////////////////////////////

library UniswapV2OracleLibrary {
    // helper function that returns the current block timestamp within the range of uint32, i.e. [0, 2**32 - 1]
    function currentBlockTimestamp() internal view returns (uint32) {
        return uint32(block.timestamp % 2 ** 32);
    }

    // produces the cumulative price using counterfactuals to save gas and avoid a call to sync.
    function currentCumulativePrices(
        address pair
    ) internal view returns (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) {
        blockTimestamp = currentBlockTimestamp();
        price0Cumulative = IUniswapV2Pair(pair).price0CumulativeLast();
        price1Cumulative = IUniswapV2Pair(pair).price1CumulativeLast();

        // if time has elapsed since the last update on the pair, mock the accumulated price values
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IUniswapV2Pair(pair).getReserves();
        if (blockTimestampLast != blockTimestamp) {
            // subtraction overflow is desired
            uint32 timeElapsed = blockTimestamp - blockTimestampLast;
            // addition overflow is desired

            // counterfactual
            int256 ratio0 = PRBMathSD59x18.div(
              int256(uint256(reserve1)),
              int256(uint256(reserve0))
            );
            price0Cumulative += uint(ratio0) * uint(timeElapsed);
            
            // counterfactual
            int256 ratio1 = PRBMathSD59x18.div(
              int256(uint256(reserve0)),
              int256(uint256(reserve1))
            );
            price1Cumulative += uint(ratio1) * uint(timeElapsed);
        }
    }
}