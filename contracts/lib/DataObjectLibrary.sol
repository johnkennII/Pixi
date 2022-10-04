// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library DataObjectLib {

    struct MarketItem {
      uint itemId;
      uint256 tokenId;
      address nftContract;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
      bool isPresale;
    }

    event MarketItemCreated (
      uint indexed itemId,
      uint256 indexed tokenId,
      address indexed nftContract,
      address seller,
      address owner,
      uint256 price,
      bool sold,
      bool isPresale
    );

    // Emit this event when a listed Item sold.
    event MarketItemSold (
        uint indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address seller,
        address owner,
        uint256 price,
        bool isPresale
    );
}