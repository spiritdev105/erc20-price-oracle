// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracleV2.sol";
import "../interfaces/IPriceOracleAggregator.sol";
import "../interfaces/ICurvePool.sol";

import "../math/BNum.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {PriceDeviationLibrary} from "../libraries/PriceDeviationLibrary.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title CurveLPNonStablePoolOracle
/// @author @conlot-crypto
/// @notice oracle for curve.fi LP token of NonStable Pool
////////////////////////////////////////////////////////////////////////////////////////////

contract CurveLPNonStablePoolOracle is IOracleV2 {
    using DataTypes for DataTypes.PriceDeviationParams;

    /// @notice address to LP
    address public immutable lp;

    /// @notice curve pool tokens
    address[] public tokens;

    /// @dev Balancer Pool tokens' decimals
    uint8[] public decimals;

    /// @dev params to calculate BPT Price
    DataTypes.PriceDeviationParams public params;

    /// @notice aggregator of price oracle for assets
    IPriceOracleAggregator public immutable aggregator;

    /// @notice address to the curve pool
    ICurvePool public immutable pool;

    constructor(
        uint256 maxPriceDeviation,
        uint256 K,
        uint256 powerPrecision,
        uint256[][] memory approximationMatrix,
        address _lp,
        ICurvePool _pool,
        uint8[] memory _decimals,
        uint256[] memory _weights,
        address[] memory _tokens,
        address _priceOracleAggregator
    ) public {
        // validate the constructor params
        require(_priceOracleAggregator != address(0), "CLPNP_AGGREGATOR");
        require(_lp != address(0), "CLPNP_LP");
        require(address(_pool) != address(0), "CLPNP_POOL");
        require(_tokens.length > 0, "BPT_TOKENS");
        require(_weights.length == _tokens.length, "BPT_WEIGHTS");
        require(_decimals.length == _tokens.length, "BPT_DECIMALS");
        require(maxPriceDeviation < BNum.BONE, "CLPNP_PRICE_DEVIATION");
        require(powerPrecision >= 1 && powerPrecision <= BNum.BONE, "CLPNP_POWER_PRECISION");
        require(
            approximationMatrix.length == 0 || approximationMatrix[0].length == _tokens.length + 1,
            "CLPNP_APPROX_MATRIX"
        );

        lp = _lp;
        pool = _pool;
        tokens = _tokens;
        decimals = _decimals;
        aggregator = IPriceOracleAggregator(_priceOracleAggregator);

        params = DataTypes.PriceDeviationParams(
            _tokens.length,
            maxPriceDeviation,
            K,
            powerPrecision,
            approximationMatrix,
            _weights
        );
    }

    /**
     * Returns the token balances in USD by multiplying each token balance with its price in USD.
     */
    function getUSDBalances() internal view returns (uint256[] memory usdBalances) {
        usdBalances = new uint256[](tokens.length);

        for (uint256 index = 0; index < tokens.length; index++) {
            uint256 pi = aggregator.getPriceInUSD(IERC20(tokens[index])) *
                PriceDeviationLibrary.EXPAND;
            require(pi > 0, "_NO_ORACLE");

            uint256 bi;
            if (18 >= decimals[index]) {
                bi = BNum.bmul(pool.balances(index), BNum.BONE * (10**(18 - decimals[index])));
            } else {
                bi = BNum.bdiv(pool.balances(index) * BNum.BONE, 10**(decimals[index] - 18));
            }
            usdBalances[index] = BNum.bmul(bi, pi);
        }
    }

    function getArithmeticMean() internal view returns (uint256) {
        uint256 totalPrice;
        for (uint256 index = 0; index < tokens.length; index++) {
            uint256 price;
            if (index > 0) {
                price = pool.price_oracle(index - 1) / (10**18);
            } else {
                price = 1;
            }
            uint256 spotPrice = (pool.balances(index) * price) / (10**decimals[index]);
            totalPrice += spotPrice;
        }
        uint256 lpTokens = IERC20(lp).totalSupply() / (10**18);
        return (totalPrice / lpTokens) * (pool.get_virtual_price() / 10**10);
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        uint256[] memory usdTotals = getUSDBalances();

        if (PriceDeviationLibrary.hasDeviation(usdTotals, params)) {
            price = int256(
                PriceDeviationLibrary.getWeightedGeometricMean(
                    usdTotals,
                    IERC20(lp).totalSupply(),
                    params
                ) / PriceDeviationLibrary.EXPAND
            );
        } else {
            price = int256(getArithmeticMean());
        }
    }
}
