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

// @title WETH Uniswap V3 Oracle
// Provide function to compute the price of tokens listed on uniswap using a "hop" token/WETH - WETH/USDC
contract WETHUniV3Oracle is IOracleV2 {
    // The average price period we want to compute in seconds
    uint32 public constant PERIOD = 3600;

    bool private immutable isBaseToken;

    IUniswapV3PoolImmutables public immutable pool;

    IUniswapV3PoolImmutables private immutable USDC_WETH;

    // @notice create a new price oracle centered around one pair, one of the token MUST be WETH
    constructor(
        IUniswapV3PoolImmutables _pool,
        IUniswapV3PoolImmutables _usdcweth,
        address weth,
        bool _isBaseToken
    ) {
        require(_pool.token0() == weth || _pool.token1() == weth, "UV3_WETH_NOT_LISTED");
        require(IUniswapV3PoolState(address(_pool)).liquidity() > 0, "UV3_NO_LIQUIDITY");
        pool = _pool;
        USDC_WETH = _usdcweth;
        isBaseToken = _isBaseToken;
    }

    function getPriceInETH() internal view returns (uint256 ethPrice) {
        int24 tick = OracleLibrary.consult(address(pool), PERIOD);
        uint256 p = OracleMath.getQuoteAtTick(tick, pool.token0(), pool.token1());
        if (!isBaseToken) {
            ethPrice = 10**36 / p;
        } else {
            ethPrice = p;
        }
    }

    // @notice The ETH price in USDC during the last PERIOD
    // @return The price in USDC, rounded to 18 decimals
    function getCurrentETHPrice() internal view returns (uint256 currentETHPrice) {
        int24 tick = OracleLibrary.consult(address(USDC_WETH), PERIOD);
        uint256 p = OracleMath.getQuoteAtTick(tick, USDC_WETH.token0(), USDC_WETH.token1());
        currentETHPrice = 10**36 / p;
    }

    function latestAnswer() external view override returns (int256 price) {
        uint256 ethPrice = getPriceInETH();
        uint256 currentETHPrice = getCurrentETHPrice();
        // after mul we have a 36 pow, divide per pow 28 to get a pow 8
        price = int256(FullMath.mulDiv(ethPrice, currentETHPrice, 10**28));
    }
}
