// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "../../interfaces/IOracleV2.sol";
import "../../interfaces/ITricrypto.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title CurveTriCryptoOracle
/// @author @conlot-crypto
/// @notice oracle for Curve TriCryptoV1 pool (0xD51a44d3FaE010294C616388b506AcdA1bfAAE46)
////////////////////////////////////////////////////////////////////////////////////////////
contract CurveTriCryptoOracle is IOracleV2 {
    /// @notice address to lp Price contract
    ITricrypto public immutable lpPrice;

    constructor(ITricrypto _lpPrice) public {
        require(address(_lpPrice) != address(0), "CLPNP_LP_PRICE");

        lpPrice = _lpPrice;
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        return int256(lpPrice.lp_price() / (10**10));
    }
}
