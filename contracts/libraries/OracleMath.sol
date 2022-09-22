pragma solidity >=0.7.0;

import "../interfaces/IERC20Decimal.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

library OracleMath {
    // @notice return the quote price in 18 decimals
    function getQuoteAtTick(
        int24 tick,
        address token0,
        address token1
    ) internal view returns (uint256 quoteAmount) {
        uint160 sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);
        uint256 ratioX128 = FullMath.mulDiv(sqrtRatioX96, sqrtRatioX96, 1 << 64);
        quoteAmount = FullMath.mulDiv(
            ratioX128,
            10**(IERC20Decimal(token0).decimals() - IERC20Decimal(token1).decimals() + 18),
            1 << 128
        );
    }

    // @notice transform any token amount/price to be displayed as N decimals
    function toNDecimals(
        address token,
        uint256 amount,
        uint8 decimals
    ) internal view returns (uint256) {
        return amount * (10**(decimals - IERC20Decimal(token).decimals()));
    }
}
