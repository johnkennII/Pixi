// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

contract Marketplace is ERC721URIStorage, ERC2981, AccessControl {
  
  ///     =====   Global Parameters  =====
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 public presaleOpeningTime;
    uint256 public presaleClosingTime;
    uint256 public lockPerdiod;
    enum Stage{ LOCKED, PRESALE, PUBLICSALE }

    address private royaltyRecipient;
    uint128 private royaltyBps;
    uint256 private constant MAX_BPS = 10_000;

    address payable owner;
    uint256 private maxAllowedPreSaleMint;

  ///     =====   Global Mapps  =====
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => RoyaltyInfo) private royaltyInfoForToken;
    mapping(address => uint256) private whiteListedAddress;

  ///     =====   Roles  =====

    // DEFAULT_ADMIN_ROLE // Contract Technical Maintenance Operations
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE"); // Allowed to Mint Token
    bytes32 public constant SUPRE_ROLE = keccak256("SUPRE_ROLE"); // Allowed to Do Financial Operations

  ///     =====   Structs  =====
    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
      bool isPresale;
    }

  ///     =====   Events  =====

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold,
      bool isPresale
    );

    event DefaultRoyalty(address indexed newRoyaltyRecipient, uint256 newRoyaltyBps);
    event RoyaltyForToken(uint256 indexed tokenId, address indexed royaltyRecipient, uint256 royaltyBps);

    ///     =====   Modifiers  =====

    modifier marketplaceStageChecker(uint256 itemId, address caller) {
      Stage currentStage = checkStage();
      bool isPresaleItem = idToMarketItem[itemId].isPresale;
      require(currentStage != Stage.LOCKED, "You can't Trade NFT at the moment.");
      if (currentStage == Stage.PRESALE) {
        require(isAllowedForPresale(caller), "Not Whitelisted!");
        require(isPresaleItem == true, "Not a Presale Item!");
      }
      if (currentStage == Stage.PUBLICSALE) {
        require(isPresaleItem == false, "Presale is over!");
      }
      _;
    }

    modifier createPreSaleItemStageChecker(bool presale) {
        if (presale) {
            require(block.timestamp < presaleClosingTime, "Presale is over!");
        }
        _;
    }

    constructor() ERC721("PixiMarket Token", "Pixi") {
      owner = payable(msg.sender);
      maxAllowedPreSaleMint = 3;
      _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
      _grantRole(SUPRE_ROLE, _msgSender());
      _grantRole(MINTER_ROLE, _msgSender());
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


    /* Mints a token and lists it in the marketplace */
    function createToken(
      string memory tokenURI, 
      uint256 price, 
      bool _isPresale) public createPreSaleItemStageChecker(_isPresale) onlyRole(MINTER_ROLE) returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price, _isPresale);
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      bool _isPresale
    ) private {
      require(price > 0, "Price must be at least 1 wei");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false,
        _isPresale
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false,
        _isPresale
      );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      idToMarketItem[tokenId].isPresale = false;
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable marketplaceStageChecker(tokenId, msg.sender) {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();

      uint256 royaltyFeeAmount;
      address royaltyFeeRecipient;
      (royaltyFeeRecipient, royaltyFeeAmount) = royaltyInfo(tokenId, price);

      _transfer(address(this), msg.sender, tokenId);
      payable(royaltyFeeRecipient).transfer(royaltyFeeAmount);
      payable(seller).transfer(price - royaltyFeeAmount);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function checkStage() public view returns (Stage stage){
      if(block.timestamp < presaleOpeningTime || (block.timestamp > presaleClosingTime && block.timestamp < presaleClosingTime + lockPerdiod) ) {
        stage = Stage.LOCKED;
        return stage;
      }
      else if(block.timestamp >= presaleOpeningTime && block.timestamp <= presaleClosingTime) {
        stage = Stage.PRESALE;
        return stage;
      }
      else if(block.timestamp >= presaleClosingTime + lockPerdiod && (presaleClosingTime != 0)) {
        stage = Stage.PUBLICSALE;
        return stage;
      } else {
        stage = Stage.LOCKED;
        return stage;
      }
    }

    ///     =====   Presale Config  =====

    function TimedCrowdsale(uint256 _openingTime, uint256 _closingTime, uint256 _lockedPerdiod) public onlyRole(DEFAULT_ADMIN_ROLE)
    {
      require(_closingTime >= _openingTime);
      presaleOpeningTime = _openingTime;
      presaleClosingTime = _closingTime;
      lockPerdiod = _lockedPerdiod;
    }

    ///     =====   Whitelisting Config  =====

    function GetDefaultMaxAllowedPreSaleMint() external view returns (uint256) {
      return maxAllowedPreSaleMint;
    }

    function SetDefaultMaxAllowedPreSaleMint(uint256 _maxAllowedPreSaleMint) public onlyRole(DEFAULT_ADMIN_ROLE) {
      maxAllowedPreSaleMint = _maxAllowedPreSaleMint;
    }

    function whiteListeNewAddress(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
        whiteListedAddress[addr] = maxAllowedPreSaleMint;
    }

    function whiteListBunchAddresses(address[] memory addrs) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 totalNewAddr = addrs.length;
        for (uint i=0; i < totalNewAddr; i++){
            whiteListedAddress[addrs[i]] = maxAllowedPreSaleMint;
        }
    }

    function setMaxAllowPerAddress(address addr, uint256 _maxAllowed) public onlyRole(DEFAULT_ADMIN_ROLE){
        whiteListedAddress[addr] = _maxAllowed;
    }

    function isAllowedForPresale(address addr) public view returns (bool){
        if (whiteListedAddress[addr] > 0) return true;
        return false;
    }

    ///     =====   Royality Config  =====

    /// See EIP-2981
    function royaltyInfo(
      uint256 tokenId, 
      uint256 salePrice) public view override 
      returns (address receiver, uint256 royaltyAmount)
    {
        (address recipient, uint256 bps) = getRoyaltyInfoForToken(tokenId);
        receiver = recipient;
        royaltyAmount = (salePrice * bps) / MAX_BPS;
    }


    function setDefaultRoyaltyInfo(address _royaltyRecipient, uint256 _royaltyBps) external onlyRole(SUPRE_ROLE)
    {
        require(_royaltyBps <= MAX_BPS, "exceed royalty bps");

        royaltyRecipient = payable(_royaltyRecipient);
        royaltyBps = uint128(_royaltyBps);

    }

    function setRoyaltyInfoForToken(
        uint256 _tokenId,
        address _recipient,
        uint96 _bps
    ) external onlyRole(SUPRE_ROLE) {
        require(_bps <= MAX_BPS, "exceed royalty bps");

        royaltyInfoForToken[_tokenId] = RoyaltyInfo({ receiver: _recipient, royaltyFraction: _bps });

        emit RoyaltyForToken(_tokenId, _recipient, _bps);
    }

    function getRoyaltyInfoForToken(uint256 _tokenId) public view returns (address, uint16) {
        RoyaltyInfo memory royaltyForToken = royaltyInfoForToken[_tokenId];

        return
            royaltyForToken.receiver == address(0)
                ? (royaltyRecipient, uint16(royaltyBps))
                : (royaltyForToken.receiver, uint16(royaltyForToken.royaltyFraction));
    }
}