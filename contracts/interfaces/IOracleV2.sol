// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

interface IOracleV2 {
    function latestAnswer() external view returns (int256);
}
