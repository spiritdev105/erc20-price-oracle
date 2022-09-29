// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracleV2.sol";
import "../interfaces/IPriceOracleAggregator.sol";
import "../interfaces/ISTETHOracle.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title STETHOracle
/// @author @conlot-crypto
/// @notice oracle for stETH
////////////////////////////////////////////////////////////////////////////////////////////

contract STETHOracle is IOracleV2 {
    /// @notice aggregator of price oracle for assets
    IPriceOracleAggregator public immutable aggregator;

    /// @dev address to the Lido's stETHPriceFeed contract
    ISTETHPriceFeed public immutable stETHPriceFeed;

    /// @dev decimals of stETH token
    uint8 public immutable decimals;

    /// @dev address to WETH/USD aggregator
    address public immutable wETH;

    constructor(
        address _stETHPriceFeed,
        address _priceOracleAggregator,
        uint8 _decimals,
        address _weth
    ) public {
        require(address(_stETHPriceFeed) != address(0), "STETH_PRICEFEED");
        require(address(_priceOracleAggregator) != address(0), "STETH_AGGREGATOR");
        require(address(_weth) != address(0), "STETH_WETH");
        require(_decimals != 0, "STETH_DECIMALS");

        stETHPriceFeed = ISTETHPriceFeed(_stETHPriceFeed);
        aggregator = IPriceOracleAggregator(_priceOracleAggregator);
        decimals = _decimals;
        wETH = _weth;
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256) {
        uint256 price;

        // get price from stETH priceFeed contract
        (uint256 currentPrice, bool isSafe) = stETHPriceFeed.current_price();
        if (isSafe) {
            price = currentPrice;
        } else {
            (uint256 safePrice, ) = stETHPriceFeed.safe_price();
            price = safePrice;
        }

        // multiplied by Ether usd price
        price = (price * aggregator.getPriceInUSD(IERC20(wETH))) / 10**decimals;
        return int256(price);
    }
}
