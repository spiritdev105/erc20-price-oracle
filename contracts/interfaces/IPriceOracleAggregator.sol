// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IOracleV2.sol";

interface IPriceOracleAggregator {
    event UpdateOracle(IERC20 token, IOracleV2 oracle);

    function getPriceInUSD(IERC20 _token) external view returns (uint256);

    function updateOracleForAsset(IERC20 _asset, IOracleV2 _oracle) external;
}
