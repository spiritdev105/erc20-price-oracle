// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IERC20Decimal.sol";
import "../interfaces/IBVaultV2.sol";
import "../interfaces/IBPoolV2.sol";
import "../interfaces/IElementConvergentCurvePool.sol";
import "../math/PRBMathSD59x18.sol";
import {DataTypes} from "./DataTypes.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title  ElementPTPriceLibrary
/// @author @commonlot
/// @notice price is in BaseToken
////////////////////////////////////////////////////////////////////////////////////////////

library ElementPTPriceLibrary {
    /// @notice convert balance with new decimals
    /// @param _balance amount
    /// @param _org orignila decimals
    /// @param _target target decimals
    function adjustDecimal(
        uint256 _balance,
        uint8 _org,
        uint8 _target
    ) internal pure returns (uint256 adjustedBalance) {
        adjustedBalance = _balance;
        if (_target < _org) {
            adjustedBalance = adjustedBalance / (10**(_org - _target));
        } else if (_target > _org) {
            adjustedBalance = adjustedBalance * (10**(_target - _org));
        }
        return adjustedBalance;
    }

    /// @dev calculate Principal Token Price in baseToken
    function calcSpotPrice(DataTypes.ElementPTParams memory params)
        internal
        view
        returns (int256 priceInUSD)
    {
        (, uint256[] memory balances, ) = IBVaultV2(params.balanceVault).getPoolTokens(
            params.balancePoolId
        );

        uint256 ptReserves = adjustDecimal(
            balances[params.ptIndex],
            params.balancePoolTokenDecimals[params.ptIndex],
            18
        );
        uint256 baseReserves = adjustDecimal(
            balances[params.baseIndex],
            params.balancePoolTokenDecimals[params.baseIndex],
            18
        );

        int256 raise = PRBMathSD59x18.div(
            int256(baseReserves),
            int256(ptReserves + IBPoolV2(params.balancerPool).totalSupply()) // totalSupply
        );

        uint256 latestBlockTimestamp = params.latestBlockTimeStamp == 0
            ? block.timestamp
            : params.latestBlockTimeStamp;

        uint256 timeRemainingSeconds = latestBlockTimestamp < params.convergentExpiration
            ? (params.convergentExpiration - latestBlockTimestamp)
            : 0;

        int256 exponent = PRBMathSD59x18.div(
            int256(timeRemainingSeconds),
            int256(params.convergentUintSecond)
        );

        priceInUSD = PRBMathSD59x18.pow(raise, exponent);
    }
}
