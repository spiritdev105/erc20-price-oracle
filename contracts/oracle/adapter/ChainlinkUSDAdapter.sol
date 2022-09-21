// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "../../interfaces/IOracleV2.sol";
import "../../interfaces/IChainlinkV3Aggregator.sol";

contract ChainlinkUSDAdapter is IOracleV2 {
    /// @dev asset name
    string public assetName;

    /// @dev asset symbol
    string public assetSymbol;

    /// @notice the asset with the price oracle
    address public immutable asset;

    /// @notice chainlink aggregator with price in USD
    IChainlinkV3Aggregator public immutable aggregator;

    constructor(
        string memory _assetName,
        string memory _assetSymbol,
        address _asset,
        IChainlinkV3Aggregator _aggregator
    ) {
        require(_asset != address(0), "USD_ADAPTER_ASSET");
        require(address(_aggregator) != address(0), "USD_ADAPTER_AGGREGATOR");
        assetName = _assetName;
        assetSymbol = _assetSymbol;
        asset = _asset;
        aggregator = _aggregator;
    }

    /// @dev returns price of asset in 1e8
    function latestAnswer() external view override returns (int256 price) {
        (, price, , , ) = aggregator.latestRoundData();
    }
}
