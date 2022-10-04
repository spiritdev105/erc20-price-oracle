// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracleV2.sol";
import "../interfaces/IElementConvergentCurvePool.sol";
import "../interfaces/IPriceOracleAggregator.sol";
import "../math/PRBMathSD59x18.sol";
import {ElementPTPriceLibrary} from "../libraries/ElementPTPriceLibrary.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MockElementFiPTPriceOracle
/// @author @conlot-crypto
/// @notice mock oracle of Element.Fi Principal Token to compare with live AMM price
////////////////////////////////////////////////////////////////////////////////////////////

contract MockElementFiPTPriceOracle is IOracleV2 {
    using DataTypes for DataTypes.ElementPTParams;

    /// @dev params to calculate ElementPTSpotPrice
    DataTypes.ElementPTParams public params;

    constructor(
        address _balanceVault,
        address _balancerPool,
        bytes32 _balancePoolId,
        uint8[] memory _balancePoolTokenDecimals,
        uint8 _ptIndex,
        uint8 _baseIndex,
        uint256 _convergentUintSecond,
        uint256 _convergentExpiration,
        uint256 _latestBlockTimeStamp
    ) {
        require(_balanceVault != address(0), "EFPT_VAULT");
        require(_balancerPool != address(0), "EFPT_POOL");
        require(_balancePoolTokenDecimals.length > 0, "EFPT_POOL_TOKENS_DECIMALS");
        require(_convergentUintSecond > 0, "EFPT_UINTSECOND");
        require(_convergentExpiration > 0, "EFPT_EXPIRATION");

        params = DataTypes.ElementPTParams(
            _balanceVault,
            _balancerPool,
            _balancePoolId,
            _balancePoolTokenDecimals,
            _ptIndex,
            _baseIndex,
            _convergentUintSecond,
            _convergentExpiration,
            _latestBlockTimeStamp
        );
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        int256 baseTokenPrice = 1e8;

        int256 spotPrice = ElementPTPriceLibrary.calcSpotPrice(params);
        require(spotPrice != 0, "Aggregator: ElementFiPTPrice");

        price = (baseTokenPrice * spotPrice) / 1e18; // should be divide by 1e18
    }
}
