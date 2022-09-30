// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
// solhint-disable

interface ICurveRegistry {
    function get_n_coins(address lp) external view returns (uint, uint);
    function get_coins(address pool) external view returns (address[8] memory);
    function get_pool_from_lp_token(address lp) external view returns (address);
}