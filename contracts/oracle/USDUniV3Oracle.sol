// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "../interfaces/IERC20Decimal.sol";
import "../interfaces/IOracleV2.sol";
import "../libraries/OracleMath.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolImmutables.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title USDUniV3Oracle
/// @author @conlot-crypto
/// @notice oracle for assets of uniswapv2 pair
////////////////////////////////////////////////////////////////////////////////////////////

contract USDUniV3Oracle is IOracleV2 {
    // The average price period we want to compute in seconds
    uint32 public constant PERIOD = 3600;

    bool private immutable isBaseToken;

    IUniswapV3PoolImmutables public immutable pool;

    // @notice create a new price oracle centered around one pair, one of the token MUST be USDC
    constructor(IUniswapV3PoolImmutables _pool, bool _isBaseToken) {
        require(IUniswapV3PoolState(address(_pool)).liquidity() > 0, "UV3_NO_LIQUIDITY");
        pool = _pool;
        isBaseToken = _isBaseToken;
    }

    // @notice Get the price token in USDC or USDT, rounded to 8 decimals
    function latestAnswer() external view override returns (int256 price) {
        int24 tick = OracleLibrary.consult(address(pool), PERIOD);
        uint256 p = OracleMath.getQuoteAtTick(tick, pool.token0(), pool.token1());
        if (!isBaseToken) {
            price = int256(10**26 / p);
        } else {
            price = int256(p / 10**10);
        }
    }
}
