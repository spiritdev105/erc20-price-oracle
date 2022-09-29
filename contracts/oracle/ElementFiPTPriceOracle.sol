// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracleV2.sol";
import "../interfaces/IPriceOracleAggregator.sol";
import {ElementPTPriceLibrary} from "../libraries/ElementPTPriceLibrary.sol";
import {DataTypes} from "../libraries/DataTypes.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title ElementFiPTPriceOracle
/// @author @conlot-crypto
/// @notice oracle for Element.Fi Principal Token
////////////////////////////////////////////////////////////////////////////////////////////

contract ElementFiPTPriceOracle is IOracleV2 {
    using DataTypes for DataTypes.ElementPTParams;

    /// @notice aggregator of price oracle for assets
    IPriceOracleAggregator public immutable aggregator;

    /// @dev params to calculate ElementPTSpotPrice
    DataTypes.ElementPTParams public params;

    /// @notice period for recomputing the average price (1 hour)
    uint256 public constant PERIOD = 1 hours;

    /// @dev baseToken address of element.fi pool
    address public immutable baseToken;

    /// @dev blockTimestamp for latest updated
    uint256 public blockTimestampLast;

    /// @dev spotPrice of element.fi Principal Token
    int256 public spotPriceLast;

    constructor(
        address _balanceVault,
        address _balancerPool,
        address _baseToken,
        bytes32 _balancePoolId,
        uint8[] memory _balancePoolTokenDecimals,
        uint8 _ptIndex,
        uint8 _baseIndex,
        uint256 _convergentUintSecond,
        uint256 _convergentExpiration,
        address _priceOracleAggregator
    ) {
        require(_balanceVault != address(0), "EFPT_VAULT");
        require(_balancerPool != address(0), "EFPT_POOL");
        require(_baseToken != address(0), "EFPT_BASETOKEN");
        require(_balancePoolTokenDecimals.length > 0, "EFPT_POOL_TOKENS_DECIMALS");
        require(_convergentUintSecond > 0, "EFPT_UINTSECOND");
        require(_convergentExpiration > 0, "EFPT_EXPIRATION");
        require(_priceOracleAggregator != address(0), "EFPT_AGGREGATOR");

        aggregator = IPriceOracleAggregator(_priceOracleAggregator);
        baseToken = _baseToken;

        params = DataTypes.ElementPTParams(
            _balanceVault,
            _balancerPool,
            _balancePoolId,
            _balancePoolTokenDecimals,
            _ptIndex,
            _baseIndex,
            _convergentUintSecond,
            _convergentExpiration,
            0
        );
    }

    function update() public {
        uint256 blockTimestamp = block.timestamp;
        if (blockTimestampLast == 0) {
            // first time to update
            spotPriceLast = ElementPTPriceLibrary.calcSpotPrice(params);
            blockTimestampLast = blockTimestamp;
        } else if (blockTimestamp - blockTimestampLast >= PERIOD) {
            // use averaget price after PERIOD time
            int256 newSpotPrice = ElementPTPriceLibrary.calcSpotPrice(params);
            spotPriceLast = (spotPriceLast + newSpotPrice) / 2;
            blockTimestampLast = blockTimestamp;
        }
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        int256 baseTokenPrice = int256(aggregator.getPriceInUSD(IERC20(baseToken)));
        require(baseTokenPrice != 0, "EFPT_NO_ORACLE");

        require(spotPriceLast != 0, "EFPT_NOT_UPDATED_YET");
        price = (baseTokenPrice * int256(spotPriceLast)) / 1e18; // should be divide by 1e18
    }
}
