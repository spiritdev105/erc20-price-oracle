// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

interface IElementConvergentCurvePool {
    function unitSeconds() external view returns (uint256);
    function expiration() external view returns (uint256);
}
