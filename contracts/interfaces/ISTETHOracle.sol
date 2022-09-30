// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
// solhint-disable

interface ISTETHPriceFeed {
    function current_price() external view returns (uint256, bool);
    function safe_price() external view returns (uint256, uint256);
}
