// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IERC20Decimal.sol";
import "../interfaces/IOracleV2.sol";
import "../interfaces/IBVaultV2.sol";
import "../interfaces/IBPoolV2.sol";
import "../interfaces/IPriceOracleAggregator.sol";
import "../math/BNum.sol";
import {DataTypes} from "../libraries/DataTypes.sol";
import {PriceDeviationLibrary} from "../libraries/PriceDeviationLibrary.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title BPTV2PriceOracle
/// @author @conlot-crypto
/// @notice oracle for Balancer BPT V2
////////////////////////////////////////////////////////////////////////////////////////////

contract BPTV2PriceOracle is IOracleV2 {
    using DataTypes for DataTypes.PriceDeviationParams;

    /// @dev params to calculate BPT Price
    DataTypes.PriceDeviationParams public params;

    /// @notice aggregator of price oracle for assets
    IPriceOracleAggregator public immutable aggregator;

    /// @dev Balancer Pool's ID
    bytes32 public immutable poolId;

    /// @dev Balancer Pool's tokens
    address[] public tokens;

    /// @dev Balancer Pool tokens' decimals
    uint8[] public decimals;

    /// @dev Balancer Pool address
    IBPoolV2 public immutable pool;

    /// @dev Balancer vault address
    IBVaultV2 public immutable vault;

    constructor(
        uint256 maxPriceDeviation,
        uint256 K,
        uint256 powerPrecision,
        uint256[][] memory approximationMatrix,
        IBVaultV2 _vault,
        IBPoolV2 _pool,
        bytes32 _poolId,
        uint8[] memory _decimals,
        uint256[] memory _weights,
        address[] memory _tokens,
        address _priceOracleAggregator
    ) {
        // validate the constructor params
        require(_priceOracleAggregator != address(0), "BPT_AGGREGATOR");
        require(address(_vault) != address(0), "BPT_VAULT");
        require(address(_pool) != address(0), "BPT_POOL");
        require(_tokens.length > 0, "BPT_TOKENS");
        require(_weights.length == _tokens.length, "BPT_WEIGHTS");
        require(_decimals.length == _tokens.length, "BPT_DECIMALS");
        require(maxPriceDeviation < BNum.BONE, "BPT_PRICE_DEVIATION");
        require(powerPrecision >= 1 && powerPrecision <= BNum.BONE, "BPT_POWER_PRECISION");
        require(
            approximationMatrix.length == 0 || approximationMatrix[0].length == _tokens.length + 1,
            "BPT_APPROX_MATRIX"
        );

        // init variables
        pool = _pool;
        vault = _vault;
        poolId = _poolId;
        tokens = _tokens;
        decimals = _decimals;
        aggregator = IPriceOracleAggregator(_priceOracleAggregator);

        // prepare params for price devitation calculation
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
        (, uint256[] memory balances, ) = vault.getPoolTokens(poolId);

        for (uint256 index = 0; index < tokens.length; index++) {
            uint256 pi = aggregator.getPriceInUSD(IERC20(tokens[index])) *
                PriceDeviationLibrary.EXPAND;
            require(pi > 0, "BPT_NO_ORACLE");

            uint256 bi;
            if (18 >= decimals[index]) {
                bi = BNum.bmul(balances[index], BNum.BONE * (10**(18 - decimals[index])));
            } else {
                bi = BNum.bdiv(balances[index] * BNum.BONE, 10**(decimals[index] - 18));
            }
            usdBalances[index] = BNum.bmul(bi, pi);
        }
    }

    /**
     * Calculates the price of the pool token using the formula of weighted arithmetic mean.
     * @param usdTotals Balance of each token in usd.
     */
    function getArithmeticMean(uint256[] memory usdTotals) internal view returns (uint256) {
        uint256 totalUsd = 0;
        for (uint256 i = 0; i < tokens.length; i++) {
            totalUsd = BNum.badd(totalUsd, usdTotals[i]);
        }
        return BNum.bdiv(totalUsd, pool.totalSupply());
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        uint256[] memory usdTotals = getUSDBalances();

        if (PriceDeviationLibrary.hasDeviation(usdTotals, params)) {
            price = int256(
                PriceDeviationLibrary.getWeightedGeometricMean(
                    usdTotals,
                    pool.totalSupply(),
                    params
                ) / PriceDeviationLibrary.EXPAND
            );
        } else {
            price = int256(getArithmeticMean(usdTotals) / PriceDeviationLibrary.EXPAND);
        }
    }
}
