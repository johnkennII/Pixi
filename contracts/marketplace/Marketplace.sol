// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import ".lib/DataObjectLibrary.sol";
import ".lib/PaymentLibrary.sol";
import ".presale/IPreSale.sol";
import ".pgtoken/IPGToken.sol";
import "hardhat/console.sol";

contract Marketplace is  
  Initializable, 
  OwnableUpgradeable, 
  UUPSUpgradeable,
  AccessControlUpgradeable,
  ReentrancyGuardUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _itemIds;
    CountersUpgradeable.Counter private _itemsSold;

    address whiteListingContractAddress;
    address nftContractAddress;
    uint256 public openingTime;
    uint256 public closingTime;
    uint256 public lockPerdiod;
    enum Stage{ PRESALE, LOCKED, PUBLICSALE }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LISTER_ROLE = keccak256("LISTER_ROLE");

    uint256 private constant VERSION = 1;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address _whiteListingContract, address _nftContractAddress) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        whiteListingContractAddress = _whiteListingContract;
        nftContractAddress = _nftContractAddress;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    mapping(uint256 => DataObjectLib.MarketItem) private idToMarketItem;


    modifier marketplaceStageChecker(uint256 itemId, address caller) {
      Stage currentStage = checkStage();
      bool isPresaleItem = idToMarketItem[itemId].isPresale;
      require(currentStage != Stage.LOCKED, "You can't Trade NFT at the moment.");
      if (currentStage == Stage.PRESALE) {
        require(isWhitelisted(caller), "Not Whitelisted!");
        require(isPresaleItem == true, "Not a Presale Item!");
      }
      if (currentStage == Stage.PUBLICSALE) {
        require(isPresaleItem == false, "Presale is over!");
      }
      _;
    }


    function isWhitelisted(address caller) public view returns (bool) {
      IPreSale presaleContract = IPreSale(whiteListingContractAddress);
      uint256 remainedAmmount = presaleContract.isAllowedForPresale(caller);
      if (remainedAmmount > 0) {return true;}
      return false;
    }


    function checkStage() public view returns (Stage stage){
      if(block.timestamp < openingTime || (block.timestamp > closingTime && block.timestamp < closingTime + lockPerdiod) ) {
        stage = Stage.LOCKED;
        return stage;
      }
      else if(block.timestamp >= openingTime && block.timestamp <= closingTime) {
        stage = Stage.PRESALE;
        return stage;
      }
      else if(block.timestamp >= closingTime + lockPerdiod) {
        stage = Stage.PUBLICSALE;
        return stage;
        }
    }

    function TimedCrowdsale(uint256 _openingTime, uint256 _closingTime, uint256 _lockedPerdiod) public onlyOwner
    {
      require(_closingTime >= _openingTime);
      openingTime = _openingTime;
      closingTime = _closingTime;
      lockPerdiod = _lockedPerdiod;
    }

    // List an item for sale in marketplace
    function createMarketItem(
        string memory uri,
        uint256 price,
        bool isPresale
    ) public nonReentrant {
        if (isPresale) {
          require(checkStage() == Stage.PUBLICSALE, "Can't add new presale item.");
        }
        // TODO: Restrict those who can mint and list new NFTs.
        require(price > 0, "Price should be higher than zero!");
        uint256 itemId = _itemIds.current();

        IPGToken pgToken = IPGToken(nftContractAddress);
        tokenId = pgToken.safeMint(uri);
        console.log(tokenId);

        idToMarketItem[itemId] =  DataObjectLib.MarketItem (
            itemId,
            tokenId,
            nftContractAddress,
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            isPresale
        );
        _itemIds.increment();
        pgToken.transfer(msg.sender, address(this), tokenId);
        
        emit DataObjectLib.MarketItemCreated(
            itemId,
            tokenId,
            nftContractAddress,
            msg.sender,
            address(0),
            price,
            false,
            isPresale
        );
    }

    function buyMarketItem(
      address nftContract,
      uint256 itemIds
    ) public payable marketplaceStageChecker(itemIds, msg.sender) nonReentrant {
      uint price = idToMarketItem[itemIds].price;
      uint tokenId = idToMarketItem[itemIds].tokenId;
      require(msg.value >= price, "Please pay asked price!");

      PaymentManagement.payout(nftContract, idToMarketItem[itemIds].seller, msg.sender, msg.value, tokenId, price);
      IERC721Upgradeable(nftContract).transferFrom(address(this), msg.sender, tokenId);
      idToMarketItem[itemIds].owner = payable(msg.sender);
      idToMarketItem[itemIds].sold = true;
      _itemsSold.increment();

      // TODO: use this event to populate the nft trade history
      emit DataObjectLib.MarketItemSold(itemIds, tokenId, nftContract, idToMarketItem[itemIds].seller, msg.sender, price, false);
    }

    function listToken(
      address nftContract,
      uint256 itemId, 
      uint256 price) public payable {
      require(idToMarketItem[itemId].owner == msg.sender, "Only item owner can perform this operation");
      idToMarketItem[itemId].sold = false;
      idToMarketItem[itemId].price = price;
      idToMarketItem[itemId].seller = payable(msg.sender);
      idToMarketItem[itemId].owner = payable(address(this));
      idToMarketItem[itemId].isPresale = false;
      _itemsSold.decrement();

      uint256 tokenId = idToMarketItem[itemId].tokenId;

      IERC721Upgradeable(nftContract).transferFrom(msg.sender, address(this), tokenId);
    }

    function fetchMarketItems() public view returns(DataObjectLib.MarketItem[] memory){
      uint totalAvailableItem = _itemIds.current();
      uint unsoldtotalAvailableItem = totalAvailableItem - _itemsSold.current();
      uint currentIndex = 0;

      DataObjectLib.MarketItem[] memory items = new DataObjectLib.MarketItem[](unsoldtotalAvailableItem);
      for (uint i=0; i < totalAvailableItem; i++){
        if (idToMarketItem[i+1].owner == address(0)){
          uint currentId = idToMarketItem[i+1].itemId;
          DataObjectLib.MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function fetchUserNFTs(address addr) public view returns(DataObjectLib.MarketItem[] memory){
      uint totalAvailableItem = _itemIds.current();
      uint userItem = 0;
      uint currentIndex = 0;
      
      for (uint i=0; i < totalAvailableItem; i++){
        if(idToMarketItem[i+1].owner == addr){
          userItem += 1;
        }
      }

      DataObjectLib.MarketItem[] memory items = new DataObjectLib.MarketItem[](userItem);
      for (uint i=0; i < totalAvailableItem; i++){
        if(idToMarketItem[i+1].owner == addr){
          uint currentId = idToMarketItem[i+1].itemId;
          DataObjectLib.MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}