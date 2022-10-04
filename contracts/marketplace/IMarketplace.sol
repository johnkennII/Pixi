// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../lib/DataObjectLibrary.sol";

interface IMarketplace {
    function TimedCrowdsale(uint256 _openingTime, uint256 _closingTime, uint256 _lockedPerdiod) external;

    function createMarketItem(address nftContract, uint256 tokenId, uint256 price, bool isPresale) external;

    function buyMarketItem(address nftContract, uint256 itemIds) payable external;

    function listToken(address nftContract, uint256 itemId, uint256 price) payable external;

    function fetchMarketItems() view external returns(DataObjectLib.MarketItem[] memory);

    function fetchUserNFTs(address addr) view external returns(DataObjectLib.MarketItem[] memory);
}