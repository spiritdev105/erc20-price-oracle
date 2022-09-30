// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

interface IBVaultV2 {
    function getPoolTokens(bytes32 poolId)
        external
        view
        returns (
            address[] memory tokens,
            uint256[] memory balances,
            uint256 lastChangeBlock
        );
}
