// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

/// Balancer Pool V2
interface IBPoolV2 {
    function getNormalizedWeights() external view returns (uint256[] memory);

    function totalSupply() external view returns (uint256);

    function getPoolId() external view returns (bytes32);

    function decimals() external view returns (uint8);
}

