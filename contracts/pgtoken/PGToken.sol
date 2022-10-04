// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
// import "./IPGToken.sol";

contract PixionGamesToken is
    ERC721Upgradeable,
    Initializable, 
    ERC721URIStorageUpgradeable, 
    OwnableUpgradeable, 
    UUPSUpgradeable, 
    ERC2981Upgradeable, 
    AccessControlUpgradeable 
{

    using CountersUpgradeable for CountersUpgradeable.Counter;

    address private royaltyRecipient;
    uint128 private royaltyBps;
    uint256 private constant VERSION = 1;
    uint256 private constant MAX_BPS = 10_000;

    event DefaultRoyalty(address indexed newRoyaltyRecipient, uint256 newRoyaltyBps);

    event RoyaltyForToken(uint256 indexed tokenId, address indexed royaltyRecipient, uint256 royaltyBps);

    // Role
    // bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");


    /// Token ID => royalty recipient and bps for token
    mapping(uint256 => RoyaltyInfo) private royaltyInfoForToken;
    
    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC721_init("PixionGamesToken", "PGK");
        __ERC721URIStorage_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, ERC2981Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(string memory uri) public override returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        // setApprovalForAll(marketplaceAddress, true);
        _tokenIdCounter.increment();
        return tokenId;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    ///     =====   External functions  =====

    /// See EIP-2981
    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view override returns (address receiver, uint256 royaltyAmount)
    {
        (address recipient, uint256 bps) = getRoyaltyInfoForToken(tokenId);
        receiver = recipient;
        royaltyAmount = (salePrice * bps) / MAX_BPS;
    }


    function setDefaultRoyaltyInfo(address _royaltyRecipient, uint256 _royaltyBps) external onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_royaltyBps <= MAX_BPS, "exceed royalty bps");

        royaltyRecipient = _royaltyRecipient;
        royaltyBps = uint128(_royaltyBps);

    }

    function setRoyaltyInfoForToken(
        uint256 _tokenId,
        address _recipient,
        uint96 _bps
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

    function contractVersion() external pure returns (uint8) {
        return uint8(VERSION);
    }
}
