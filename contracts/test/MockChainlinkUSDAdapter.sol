// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "../interfaces/IOracleV2.sol";

contract MockChainlinkUSDAdapter is IOracleV2 {
    function latestAnswer() external view override returns (int256 price) {
        return 1e8;
    }
}
