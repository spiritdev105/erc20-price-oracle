// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title  DataTypes
/// @author @conlot-crypto
/// @notice price is in BaseToken
////////////////////////////////////////////////////////////////////////////////////////////

library DataTypes {
    struct ElementPTParams {
        address balanceVault;
        address balancerPool;
        bytes32 balancePoolId;
        uint8[] balancePoolTokenDecimals;
        uint8 ptIndex;
        uint8 baseIndex;
        uint256 convergentUintSecond;
        uint256 convergentExpiration;
        uint256 latestBlockTimeStamp; // this is used for MockElementFiPTPriceOracle
    }

    struct PriceDeviationParams {
        uint256 tokenLength; // tokens length
        uint256 maxPriceDeviation; // Threshold of spot prices deviation: 10ˆ16 represents a 1% deviation. Must be between 1 and 10ˆ18.
        uint256 K; // Constant K=1/ (w1ˆw1 * .. * wn^wn)
        uint256 powerPrecision; // Precision for power math function.
        uint256[][] approximationMatrix; // Approximation matrix for gas optimization
        uint256[] weights; // token weights
    }
}
