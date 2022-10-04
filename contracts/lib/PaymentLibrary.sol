// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";


library PaymentManagement{
    function payout(
      address nftContract,
      address seller,
      address _payer,
      uint256 _totalPayoutAmount,
      uint256 tokenId,
      uint256 price
    ) internal {
      
      uint256 royaltyCut;
      address royaltyRecipient;

      try IERC2981Upgradeable(nftContract).royaltyInfo(tokenId, _totalPayoutAmount) returns (
          address royaltyFeeRecipient,
          uint256 royaltyFeeAmount
        ) {
          if (royaltyFeeRecipient != address(0) && royaltyFeeAmount > 0) {
            require(royaltyFeeAmount <= _totalPayoutAmount, "fees exceed the price");
            royaltyRecipient = royaltyFeeRecipient;
            royaltyCut = royaltyFeeAmount;
          }
      } catch {}
      payable(_payer).transfer(_totalPayoutAmount - price);
      payable(seller).transfer(price - royaltyCut);
      payable(royaltyRecipient).transfer(royaltyCut);

  }

}