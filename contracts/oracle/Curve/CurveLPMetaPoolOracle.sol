// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IOracleV2.sol";
import "../../interfaces/IPriceOracleAggregator.sol";
import "../../interfaces/ICurveRegistry.sol";
import "../../interfaces/ICurvePool.sol";
import "../../interfaces/IERC20Decimal.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title CurveLPMetaPoolOracle
/// @author @conlot-crypto
/// @notice oracle for Curve.Fi LP Token
////////////////////////////////////////////////////////////////////////////////////////////

contract CurveLPMetaPoolOracle is IOracleV2 {
    /// @notice aggregator of price oracle for assets
    IPriceOracleAggregator public immutable aggregator;

    /// @notice Curve Registry
    ICurveRegistry public immutable registry;

    /// @notice pool token length
    uint256 public immutable tokensLength;

    /// @notice address to LP
    address public immutable lp;

    /// @notice curve pool tokens
    address[] public tokens;

    /// @notice address to the curve pool
    address public immutable pool;

    constructor(
        address _priceOracleAggregator,
        address _registry,
        address _lp,
        address _pool,
        uint256 _tokensLength,
        address[] memory _tokens
    ) public {
        require(_priceOracleAggregator != address(0), "CVMETA_AGGREGATOR");
        require(_registry != address(0), "CVMETA_POOL_REGISTRY");
        require(_lp != address(0), "CVMETA_LP");
        require(_pool != address(0), "CVMETA_POOL");
        require(_tokensLength > 0, "CVMETA_TOKEN_LENGTH");
        require(_tokens.length == _tokensLength, "CVMETA_TOKENS");

        aggregator = IPriceOracleAggregator(_priceOracleAggregator);
        registry = ICurveRegistry(_registry);
        lp = _lp;
        pool = _pool;
        tokensLength = _tokensLength;
        tokens = _tokens;
    }

    /// @dev return usd price of oracle asset
    function latestAnswer() external view override returns (int256 price) {
        int256 minPx = type(int256).max;
        for (uint256 index = 0; index < tokensLength; index++) {
            int256 tokenPx = int256(aggregator.getPriceInUSD(IERC20(tokens[index])));
            require(tokenPx > 0, "CVMETA_NO_ORACLE");

            if (tokenPx < minPx) {
                minPx = tokenPx;
            }
        }
        require(minPx != type(int256).max, "CVMETA_NO_MINPX");

        price = (minPx * int256(ICurvePool(pool).get_virtual_price())) / 1e18;
    }
}
